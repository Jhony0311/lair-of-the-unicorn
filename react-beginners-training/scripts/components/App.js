/**
 * App Component
 * <App />
 */

import React from 'react';
import Rebase from 're-base';
import Catalyst from 'react-catalyst';

/**
 * Import Components
 */
import Header from './Header';
import Fish from './Fish';
import Inventory from './Inventory';
import Order from './Order';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

let base = Rebase.createClass('https://react-store-ex.firebaseio.com/');

@autobind
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            fishes: {},
            order: {}
        };
    }
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
    }
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    }
    addFish(fish) {
        let timestamp = (new Date()).getTime();
        this.state.fishes[`fish-${timestamp}`] = fish;
        this.setState({fishes: this.state.fishes});
    }
    removeFromOrder(key) {
        delete this.state.order[key];
        this.setState({ order: this.state.order });
    }
    removeFish(key) {
        if(confirm('Are you sure to remove this fish?')) {
            this.state.fishes[key] = null;
            this.setState({ fishes: this.state.fishes });
        }
    }
    addToOrder(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order: this.state.order });
    }
    loadSamples() {
        this.setState({
            fishes: require('../sample-fishes')
        });
    }
    renderFish(key) {
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
    }
    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
                <Inventory addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={() => this.linkState} />
            </div>
        )
    }
};

reactMixin(App, Catalyst.LinkedStateMixin);

export default App;
