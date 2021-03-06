'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAutosuggest = require('react-autosuggest');

var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _reactThemeable = require('react-themeable');

var _reactThemeable2 = _interopRequireDefault(_reactThemeable);

var _theme = require('./theme');

var _theme2 = _interopRequireDefault(_theme);

var _Chip = require('./Chip');

var _Chip2 = _interopRequireDefault(_Chip);

var _CallLimiter = require('./CallLimiter');

var _CallLimiter2 = _interopRequireDefault(_CallLimiter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chips = function (_Component) {
  _inherits(Chips, _Component);

  function Chips(props) {
    _classCallCheck(this, Chips);

    var _this = _possibleConstructorReturn(this, (Chips.__proto__ || Object.getPrototypeOf(Chips)).call(this, props));

    _this.componentWillReceiveProps = function (nextProps) {
      _this.asyncSuggestLimiter.interval = 1000 / nextProps.fetchSuggestionsThrushold;
    };

    _this.onBlur = function (e) {
      _this.refs.wrapper.focus();
    };

    _this.onFocus = function (e) {
      _this.refs.wrapper.blur();
    };

    _this.handleKeyDown = function (e) {
      if (e.keyCode === 13 && _this.lastEvent === e) {
        _this.lastEvent = null;
        return;
      }
      if (!_this.props.fromSuggestionsOnly && (_this.props.createChipKeys.includes(e.keyCode) || _this.props.createChipKeys.includes(e.key))) {
        e.preventDefault();
        if (_this.state.value.trim()) _this.addChip(_this.state.value);
      }
      if (e.keyCode === 8) {
        _this.onBackspace();
      } else if (_this.state.chipSelected) {
        _this.setState({ chipSelected: false });
      }
    };

    _this.onBackspace = function (code) {
      if (_this.state.value === "" && _this.props.value.length > 0) {
        if (_this.state.chipSelected) {
          var nextChips = _this.props.value.slice(0, -1);
          _this.setState({
            chipSelected: false,
            chips: nextChips
          });
          _this.props.onChange(nextChips);
        } else {
          _this.setState({ chipSelected: true });
        }
      }
    };

    _this.addChip = function (value) {
      if (_this.props.uniqueChips && _this.props.value.indexOf(value) !== -1) {
        _this.setState({ value: "" });
        return;
      }
      var chips = [].concat(_toConsumableArray(_this.props.value), [value]);
      _this.props.onChange(chips);
      _this.setState({ value: "" });
    };

    _this.removeChip = function (idx) {
      return function () {
        var left = _this.props.value.slice(0, idx);
        var right = _this.props.value.slice(idx + 1);
        var nextChips = [].concat(_toConsumableArray(left), _toConsumableArray(right));
        _this.props.onChange(nextChips);
      };
    };

    _this.renderChips = function () {
      return _this.props.value.map(function (chip, idx) {
        return _react2.default.cloneElement(_this.props.renderChip(chip), {
          selected: _this.state.chipSelected && idx === _this.props.value.length - 1,
          onRemove: _this.removeChip(idx),
          index: idx,
          key: 'chip' + idx
        });
      });
    };

    _this.filterUniqueChips = function (suggestions) {
      var _this$props = _this.props,
          value = _this$props.value,
          getChipValue = _this$props.getChipValue,
          getSuggestionValue = _this$props.getSuggestionValue;


      return suggestions.filter(function (suggestion) {
        return !value.some(function (chip) {
          return getChipValue(chip) == getSuggestionValue(suggestion);
        });
      });
    };

    _this.callFetchSuggestions = function (fetchSuggestions, value, canceled) {
      var uniqueChips = _this.props.uniqueChips;


      var callback = function callback(suggestions) {
        if (!canceled.isCancaled()) {
          _this.setState({
            loading: false,
            suggestions: uniqueChips ? _this.filterUniqueChips(suggestions) : suggestions
          });
        }
      };

      var suggestionResult = fetchSuggestions.call(_this, value, callback);

      if (suggestionResult && 'then' in suggestionResult) {
        // To Support Promises
        suggestionResult.then(callback);
      }
    };

    _this.onSuggestionsFetchRequested = function (_ref) {
      var value = _ref.value;
      var _this$props2 = _this.props,
          uniqueChips = _this$props2.uniqueChips,
          suggestions = _this$props2.suggestions,
          fetchSuggestions = _this$props2.fetchSuggestions,
          suggestionsFilter = _this$props2.suggestionsFilter;


      if (fetchSuggestions) {
        _this.setState({ loading: true });

        _this.asyncSuggestLimiter.invoke(fetchSuggestions, value);
      } else {
        _this.setState({
          suggestions: (uniqueChips ? _this.filterUniqueChips(suggestions) : suggestions).filter(function (opts) {
            return suggestionsFilter(opts, value);
          })
        });
      }
    };

    _this.onSuggestionsClearRequested = function () {
      _this.setState({ suggestions: [] });
    };

    _this.onSuggestionSelected = function (e, _ref2) {
      var suggestion = _ref2.suggestion;

      _this.lastEvent = e;
      _this.addChip(suggestion);
      _this.setState({ value: '' });
    };

    _this.onChange = function (e, _ref3) {
      var newValue = _ref3.newValue;

      if (!_this.props.fromSuggestionsOnly && newValue.indexOf(',') !== -1) {
        var chips = newValue.split(",").map(function (val) {
          return val.trim();
        }).filter(function (val) {
          return val !== "";
        });
        chips.forEach(function (chip) {
          _this.addChip(chip);
        });
      } else {
        _this.setState({ value: newValue });
      }
    };

    _this.state = {
      loading: false,
      value: "",
      chipSelected: false,
      suggestions: []
    };

    _this.asyncSuggestLimiter = new _CallLimiter2.default(_this.callFetchSuggestions.bind(_this), 1000 / props.fetchSuggestionsThrushold);
    return _this;
  }

  _createClass(Chips, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          loading = _state.loading,
          value = _state.value,
          suggestions = _state.suggestions;
      var _props = this.props,
          placeholder = _props.placeholder,
          renderLoading = _props.renderLoading;

      var themr = (0, _reactThemeable2.default)(this.props.theme);

      var inputProps = {
        placeholder: placeholder,
        value: value,
        onChange: this.onChange,
        onKeyDown: this.handleKeyDown,
        onBlur: this.onBlur,
        onFocus: this.onFocus
      };

      return _react2.default.createElement(
        'div',
        _extends({}, themr(200, 'chipsContainer'), { ref: 'wrapper' }),
        this.renderChips(),
        _react2.default.createElement(_reactAutosuggest2.default, _extends({}, this.props, {
          theme: this.props.theme,
          suggestions: this.state.suggestions,
          onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
          onSuggestionsClearRequested: this.onSuggestionsClearRequested,
          getSuggestionValue: function getSuggestionValue(val) {
            return _this2.state.value;
          },
          inputProps: inputProps,
          onSuggestionSelected: this.onSuggestionSelected
        })),
        loading ? renderLoading() : null
      );
    }
  }]);

  return Chips;
}(_react.Component);

Chips.propTypes = {
  value: _propTypes2.default.array.isRequired,
  onChange: _propTypes2.default.func,
  placeholder: _propTypes2.default.string,
  theme: _propTypes2.default.object,
  suggestions: _propTypes2.default.array,
  fetchSuggestions: _propTypes2.default.func,
  fetchSuggestionsThrushold: _propTypes2.default.number,
  fromSuggestionsOnly: _propTypes2.default.bool,
  uniqueChips: _propTypes2.default.bool,
  renderChip: _propTypes2.default.func,
  suggestionsFilter: _propTypes2.default.func,
  getChipValue: _propTypes2.default.func,
  createChipKeys: _propTypes2.default.array,
  getSuggestionValue: _propTypes2.default.func,
  renderSuggestion: _propTypes2.default.func,
  shouldRenderSuggestions: _propTypes2.default.func,
  alwaysRenderSuggestions: _propTypes2.default.bool,
  highlightFirstSuggestion: _propTypes2.default.bool,
  focusInputOnSuggestionClick: _propTypes2.default.bool,
  multiSection: _propTypes2.default.bool,
  renderSectionTitle: _propTypes2.default.func,
  getSectionSuggestions: _propTypes2.default.func
};

Chips.defaultProps = {
  placeholder: '',
  theme: _theme2.default,
  suggestions: [],
  fetchSuggestions: null,
  fetchSuggestionsThrushold: 10,
  createChipKeys: [9],
  fromSuggestionsOnly: false,
  uniqueChips: true,
  getSuggestionValue: function getSuggestionValue(s) {
    return s;
  },
  value: [],
  onChange: function onChange() {},
  renderChip: function renderChip(value) {
    return _react2.default.createElement(
      _Chip2.default,
      null,
      value
    );
  },
  renderLoading: function renderLoading() {
    return _react2.default.createElement(
      'span',
      null,
      'Loading...'
    );
  },
  renderSuggestion: function renderSuggestion(suggestion, _ref4) {
    var query = _ref4.query;
    return _react2.default.createElement(
      'span',
      null,
      suggestion
    );
  },
  suggestionsFilter: function suggestionsFilter(opt, val) {
    return opt.toLowerCase().indexOf(val.toLowerCase()) !== -1;
  },
  getChipValue: function getChipValue(item) {
    return item;
  }
};

exports.default = (0, _radium2.default)(Chips);