/**
 * Fish Component
 * <Fish />
 */

import React from 'react';
import helpers from '../helpers';
import autobind from 'autobind-decorator';

@autobind
class Fish extends React.Component {
    orderFish() {
        this.props.addToOrder(this.props.index);
    }
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
}

export default Fish;
