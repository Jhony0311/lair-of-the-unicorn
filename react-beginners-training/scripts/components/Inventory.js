/**
 * Inventory Component
 * <Inventory />
 */
import React from 'react';
import AddFishForm from './AddFishForm';

let Inventory = React.createClass({
    renderInventory(key) {
        let linkState = this.props.linkState;
        return (
            <div className="fish-edit" key={key}>
                <input type="text" valueLink={linkState(`fishes.${key}.name`)} />
                <input type="text" valueLink={linkState(`fishes.${key}.price`)} />
                <select valueLink={linkState(`fishes.${key}.status`)}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea valueLink={linkState(`fishes.${key}.desc`)}></textarea>
                <input type="text" valueLink={linkState(`fishes.${key}.image`)} />
                <button onClick={this.props.removeFish.bind(null, key)}>Remove fish</button>
            </div>
        )
    },
    render() {
        return (
            <div>
                <p>Inventory</p>
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm {...this.props} />
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    },
    propTypes: {
        linkState: React.PropTypes.func.isRequired,
        loadSamples: React.PropTypes.func.isRequired,
        fishes: React.PropTypes.object.isRequired,
        addFish: React.PropTypes.func.isRequired,
        removeFish: React.PropTypes.func.isRequired
    }
});

export default Inventory;