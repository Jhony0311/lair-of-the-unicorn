const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Link = ReactRouter.Link;
const browserHistory = require('history/lib/createBrowserHistory');

const helpers = require('./helpers');

/**
 * App Component
 * <App />
 */

let App =  React.createClass({
    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                </div>
                <Order />
                <Inventory />
            </div>
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
    render: function() {
        return (
            <p>Order</p>
        )
    }
});

/**
 * Inventory Component
 * <Inventory />
 */

let Inventory = React.createClass({
    render: function() {
        return (
            <p>Inventory</p>
        )
    }
});

/**
 * StorePicker
 * This will let us make <StorePicker/>
 */

let StorePicker = React.createClass({
    goToStore: function(e) {
        e.preventDefault();
        console.log('Ya submitted it');
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
