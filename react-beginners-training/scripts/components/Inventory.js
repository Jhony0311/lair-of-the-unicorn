/**
 * Inventory Component
 * <Inventory />
 */
import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://react-store-ex.firebaseio.com/');

@autobind
class Inventory extends React.Component {
    constructor() {
        super();
        this.state = {
            uid: ''
        };
    }
    renderLogin() {
        return (
            <nav className="login">
                <h1>Inventory</h1>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={this.authenticate.bind(this, 'github')}>Login with Github</button>
            </nav>
        );
    }
    authenticate(provider) {
        console.log(provider);
        ref.authWithOAuthPopup(provider, this.authHandler);
    }
    authHandler(err, authData) {
        if(err) {
            console.console.log(err);
            return;
        }
        const storeRef = ref.child(this.props.params.storeID);
        storeRef.on('value', (snapshot) => {
            let data = snapshot.val() || {};
            // claim ownership if it's available
            if(!data.owner) {
                storeRef.set({
                    owner: authData.uid
                });
            }
            // update our state to reflect the current user
            this.setState({
                uid: authData.uid,
                owner: data.owner || authData.uid
            })
        })
    }
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
    }
    render() {
        let logoutButton = <button>Log Out!</button>;
        if(!this.state.uid) {
            return (
                <div>{this.renderLogin()}</div>
            );
        }
        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry, you aren't the owner of this store</p>
                </div>
            );
        }
        return (
            <div>
                <p>Inventory</p>
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm {...this.props} />
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    }
};

Inventory.propTypes = {
    linkState: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    addFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired
};

export default Inventory;
