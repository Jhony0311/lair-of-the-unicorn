const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Link = ReactRouter.Link;
const History = ReactRouter.History;
const browserHistory = require('history/lib/createBrowserHistory');

const helpers = require('./helpers');

// Firebase deps
const Rebase = require('re-base');
let base = Rebase.createClass('https://react-store-ex.firebaseio.com/');

const Catalyst = require('react-catalyst');

/**
 * App Component
 * <App />
 */

let App =  React.createClass({
    mixins: [Catalyst.LinkedStateMixin],
    getInitialState() {
        return {
            fishes: {},
            order: {}
        }
    },
    componentDidMount() {
        // Params: {url}, {object -> context, state}
        base.syncState(`${this.props.params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });
        let localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
        if(localStorageRef) {
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    },
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    },
    addFish(fish) {
        let timestamp = (new Date()).getTime();
        this.state.fishes[`fish-${timestamp}`] = fish;
        this.setState({fishes: this.state.fishes});
    },
    addToOrder(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order: this.state.order });
    },
    loadSamples() {
        this.setState({
            fishes: require('./sample-fishes')
        });
    },
    renderFish(key) {
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
    },
    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} />
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} />
            </div>
        )
    }
});

/**
 * Fish Component
 * <Fish />
 */

let Fish = React.createClass({
    orderFish() {
        this.props.addToOrder(this.props.index);
    },
    render() {
        let details = this.props.details;
        let isAvailable = (details.status === 'available' ? true : false);
        var buttonText = (isAvailable ? 'Add To Order': 'Sold Out!');
        return (
            <li className="menu-fish">
                <img src={details.image} alt={details.name} />
                <h3 className="fish-name">
                    {details.name}
                    <span className="price">{helpers.formatPrice(details.price)}</span>
                </h3>
                <p>{details.desc}</p>
                <button onClick={this.orderFish} disabled={!isAvailable}>{buttonText}</button>
            </li>
        )
    }
});

/**
 * Add fish form Component
 * <AddFishForm />
 */

let AddFishForm = React.createClass({
    createFish(e) {
        e.preventDefault();
        let fish = {
            name: this.refs.name.value,
            price: this.refs.price.value,
            status: this.refs.status.value,
            desc: this.refs.desc.value,
            image: this.refs.image.value
        };
        this.props.addFish(fish);
        this.refs.fishForm.reset();
    },
    render: function() {
        return (
            <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
                <input type="text" ref="name" placeholder="Fish Name" />
                <input type="text" ref="price" placeholder="Fish Price" />
                <select ref="status">
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea type="text" ref="desc" placeholder="Desc"></textarea>
                <input type="text" ref="image" placeholder="URL to Image" />
                <button type="submit">+ Add Item</button>
            </form>
        )
    }
});

/**
 * Header Component
 * <Header />
 */

let Header = React.createClass({
    render: function() {
        return (
            <header className="top">
                <h1>Catch
                    <span className="ofThe">
                        <span className="of">of</span>
                        <span className="the">the</span>
                    </span>
                day</h1>
                <h3 className="tagline"><span>{this.props.tagline}</span></h3>
            </header>
        )
    }
});

/**
 * Order Component
 * <Order />
 */

let Order = React.createClass({
    renderOrder(key) {
        let fish = this.props.fishes[key];
        let count = this.props.order[key];
        if (!fish) {
            return <li key={key}>Sorry, fish no longer available</li>
        }
        return (
            <li key={key}>
                {count}lbs
                {fish.name}
                <span className="price">{helpers.formatPrice(count * fish.price)}</span>
            </li>
        );
    },
    render: function() {
        let orderIds = Object.keys(this.props.order);
        let total = orderIds.reduce((prevTotal, key) => {
            let fish = this.props.fishes[key];
            let count = this.props.order[key];
            let isAvailable = fish && fish.status === 'available';
            if(fish && isAvailable) {
                return prevTotal + (count * parseInt(fish.price) || 0);
            }

            return prevTotal;
        }, 0);
        return (
            <div className="order-wrap">
                <h2 className="order-title">Your Order</h2>
                <ul className="order">
                    {orderIds.map(this.renderOrder)}
                    <li className="total"><strong>Total:</strong>{helpers.formatPrice(total)}</li>
                </ul>
            </div>
        )
    }
});

/**
 * Inventory Component
 * <Inventory />
 */

let Inventory = React.createClass({
    renderInventory(key) {
        let linkState = this.props.linkState;
        return (
            <div className="fish-edit" key={key}>
                <input type="text" valueLink={linkState(`fishes.${key}.name`)} />
            </div>
        )
    },
    render: function() {
        return (
            <div>
                <p>Inventory</p>
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm {...this.props} />
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
});

/**
 * StorePicker
 * This will let us make <StorePicker/>
 */

let StorePicker = React.createClass({
    mixins: [History],
    goToStore: function(e) {
        e.preventDefault();
        let storeId = this.refs.storeId.value;
        this.history.pushState(null, `/store/${storeId}`);
    },
    render: function() {
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
                {/* Here is a PROPER comment on JSX */}
                <h2>Please Enter A Strore</h2>
                <input type="text" ref="storeId" defaultValue={helpers.getFunName()} required />
                <input type="Submit" />
            </form>
        )
    }
});

/**
 * 404: Component
 */

let NotFound = React.createClass({
    render: function() {
        return(
            <h1>Not Found!</h1>
        )
    }
});

/**
 * Routes: Reac router routes
 */

let routes = (
    <Router history={browserHistory()}>
        <Route path="/" component={StorePicker} />
        <Route path="/store/:storeId" component={App} />
        <Route path="*" component={NotFound} />
    </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));
