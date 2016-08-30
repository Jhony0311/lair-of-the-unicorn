/**
 * StorePicker
 * This will let us make <StorePicker/>
 */

import React from 'react';
import { History } from 'react-router';
import helpers from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

@autobind
class StorePicker extends React.Component {
    goToStore(e) {
        e.preventDefault();
        let storeId = this.refs.storeId.value;
        this.history.pushState(null, `/store/${storeId}`);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={this.goToStore}>
            {/* Here is a PROPER comment on JSX */}
            <h2>Please Enter A Strore</h2>
            <input type="text" ref="storeId" defaultValue={helpers.getFunName()} required />
            <input type="Submit" />
            </form>
        )
    }
}

reactMixin.onClass(StorePicker, History);

export default StorePicker;
