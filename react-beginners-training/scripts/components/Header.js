/**
 * Header Component
 * <Header />
 */

import React from 'react';
import helpers from '../helpers';

let Header = React.createClass({
    render() {
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
    },
    propTypes: {
        tagline: React.PropTypes.string.isRequired
    }
});

export default Header
