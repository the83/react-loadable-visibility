'use strict';

exports.__esModule = true;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _capacities = require('./capacities');

var _tracked_elements = require('./tracked_elements');

var _tracked_elements2 = _interopRequireDefault(_tracked_elements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var intersectionObserver = void 0;

if (_capacities.IntersectionObserver) {
  intersectionObserver = new window.IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      var trackedElement = _tracked_elements2.default.get(entry.target);

      if (trackedElement && entry.intersectionRatio > 0) {
        trackedElement.visibilityHandler();
      }
    });
  });
}

function createLoadableVisibilityComponent(args, _ref) {
  var Loadable = _ref.Loadable,
      preloadFunc = _ref.preloadFunc,
      LoadingComponent = _ref.LoadingComponent;

  var preloaded = false;
  var visibilityHandlers = [];

  var LoadableComponent = Loadable.apply(undefined, args);

  return function (_React$Component) {
    _inherits(LoadableVisibilityComponent, _React$Component);

    LoadableVisibilityComponent[preloadFunc] = function () {
      preloaded = true;
      LoadableComponent[preloadFunc]();
    };

    function LoadableVisibilityComponent(props) {
      _classCallCheck(this, LoadableVisibilityComponent);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.visibilityHandler = function () {
        var element = _this.refs.loading;

        if (element) {
          intersectionObserver.unobserve(element);
          _tracked_elements2.default.delete(element);
        }

        _this.setState({
          visible: true
        });
      };

      _this.state = {
        visible: preloaded
      };
      return _this;
    }

    LoadableVisibilityComponent.prototype.componentDidMount = function componentDidMount() {
      if (!preloaded) {
        var element = this.refs.loading;
        _tracked_elements2.default.set(element, this);
        intersectionObserver.observe(element);
      }
    };

    LoadableVisibilityComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      var element = this.refs.loading;

      if (element) {
        intersectionObserver.unobserve(element);
        _tracked_elements2.default.delete(element);
      }
    };

    LoadableVisibilityComponent.prototype.render = function render() {
      if (this.state.visible) {
        return React.createElement(LoadableComponent, this.props);
      }

      if (LoadingComponent) {
        return React.createElement(
          'div',
          {
            style: { display: 'inline-block', minHeight: '1px', minWidth: '1px' },
            className: this.props.className,
            ref: 'loading'
          },
          React.createElement(LoadingComponent, {
            isLoading: true
          })
        );
      }

      return React.createElement('div', {
        style: { display: 'inline-block', minHeight: '1px', minWidth: '1px' },
        className: this.props.className,
        ref: 'loading'
      });
    };

    return LoadableVisibilityComponent;
  }(React.Component);
}

exports.default = createLoadableVisibilityComponent;