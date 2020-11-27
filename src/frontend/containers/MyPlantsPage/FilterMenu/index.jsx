import React, { useState } from 'react';
import { Button, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.scss';

const Clickable = (label, onClick) => (
  <span
    className="clickable"
    onClick={onClick}
    onKeyUp={onClick}
    role="button"
    tabIndex={0}
  ><Dropdown.ItemText>{label}</Dropdown.ItemText>
  </span>
);

const FilterMenu = React.forwardRef(
  ({ style, className, onChange }, ref) => {
    const [state, setState] = useState({ filters: [], field: '', equivalence: '', value: '' });

    const addFilter = () => {
      const { field, equivalence, value } = state;

      if (!field || !equivalence || !value) return;

      onChange([...state.filters, { field, equivalence, value }]);
      setState((prevState) => ({
        ...state,
        filters: [...prevState.filters, { field, equivalence, value }],
        field: '',
        equivalence: '',
        value: '',
      }));
    };

    const removeFilter = (index) => {
      onChange(state.filters.slice(0, index).concat(state.filters.slice(index + 1)));
      setState({
        ...state,
        filters: state.filters.slice(0, index).concat(state.filters.slice(index + 1)),
      });
    };

    const onDropdownClick = (field, value) => {
      setState({ ...state, [field]: value });
    };

    let valueJSX = (
      <FormControl
        autoFocus
        className="w-auto"
        placeholder="Value to filter by"
        onChange={(e) => setState({ ...state, value: e.target.value })}
        value={state.value}
      />
    );

    if (state.field === 'Carnivorous') {
      valueJSX = (
        <DropdownButton
          className="white-button"
          title={state.value || 'Value'}
        >
          {Clickable('True', () => onDropdownClick('value', 'true'))}
          {Clickable('False', () => onDropdownClick('value', 'false'))}
        </DropdownButton>
      );
    }

    const filtersJSX = state.filters.length
      ? state.filters.map((filter, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={index} id="add-filter-row" className="filter-row">
          <DropdownButton className="white-button" title={filter.field} disabled />
          <DropdownButton
            className="white-button"
            as={InputGroup.Append}
            title={filter.equivalence}
            disabled
          />
          <FormControl
            className="w-auto"
            value={filter.value}
            disabled
          />
          <Button variant="danger" onClick={() => removeFilter(index)}>{'\u2715'}</Button>
        </span>
      ))
      : <p className="default-message">No filters currently added</p>;

    return (
      <div
        ref={ref}
        style={style}
        id="filter-dropdown-menu"
        className={className}
      >
        {filtersJSX}

        <span id="add-filter-row" className="filter-row">
          <DropdownButton
            className="white-button"
            title={state.field || 'Field'}
          >
            {Clickable('Type', () => onDropdownClick('field', 'Type'))}
            {Clickable('Carnivorous', () => onDropdownClick('field', 'Carnivorous'))}
          </DropdownButton>

          <DropdownButton
            className="white-button"
            title={state.equivalence || 'Equivalence'}
          >
            {Clickable('=', () => onDropdownClick('equivalence', '='))}
            {Clickable('\u2260', () => onDropdownClick('equivalence', '\u2260'))}
          </DropdownButton>

          {valueJSX}
        </span>
        <Button className="w-100" variant="primary" onClick={addFilter}>Add Filter</Button>
      </div>
    );
  },
);

FilterMenu.defaultProps = {
};

FilterMenu.propTypes = {
  style: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterMenu;
