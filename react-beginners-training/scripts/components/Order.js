/**
 * Order Component
 * <Order />
 */

import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import helpers from '../helpers';

let Order = React.createClass({
    renderOrder(key) {
        let fish = this.props.fishes[key];
        let count = this.props.order[key];
        let removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>
        if (!fish) {
            return <li key={key}>Sorry, fish no longer available {removeButton}</li>
        }
        return (
            <li key={key}>
                <CSSTransitionGroup component="span" transitionName="count" transitionLeaveTimeout={250} transitionEnterTimeout={250}>
                    <span key={count}>{count}</span>
                </CSSTransitionGroup>
                lbs {fish.name}
                <span className="price">{helpers.formatPrice(count * fish.price)}</span>
                {removeButton}
            </li>
        );
    },
    render() {
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
                <CSSTransitionGroup transitionName="order" transitionEnterTimeout={500} transitionLeaveTimeout={500} className="order" component="ul">
                    {orderIds.map(this.renderOrder)}
                    <li className="total"><strong>Total:</strong>{helpers.formatPrice(total)}</li>
                </CSSTransitionGroup>
            </div>
        )
    },
    propTypes: {
        fishes: React.PropTypes.object.isRequired,
        order: React.PropTypes.object.isRequired,
        removeFromOrder: React.PropTypes.func.isRequired
    }
});

export default Order;
