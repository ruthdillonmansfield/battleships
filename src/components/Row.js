import React from 'react';
import Cell from './Cell'

const Row = props => {
    const cells = props.cells.map((el, i) => {
        return (
            <Cell />
        )
    })
    return (
        <div className='row'>
            {cells}
        </div>
    );
};

// Row.propTypes = {
//   setGame: propTypes.any.isRequired
// };

export default Row;