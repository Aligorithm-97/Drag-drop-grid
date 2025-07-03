// @ts-nocheck
import React from 'react';
import _ from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PieChart } from 'react-minimal-pie-chart';
import PieChart3d from './components/PieChart3d';
import { GeoChart } from './components/GeoChart';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ChartBox = () => (
  <div className="flex h-full w-full items-center justify-center rounded bg-red-400 text-white shadow">
    <PieChart
      data={[
        { title: 'One', value: 10, color: '#E38627' },
        { title: 'Two', value: 15, color: '#C13C37' },
        { title: 'Three', value: 20, color: '#6A2135' },
      ]}
    />
  </div>
);

const TextBox = () => (
  <div className="flex h-full w-full items-center justify-center rounded  text-white shadow">
    <GeoChart />
  </div>
);

const ImageBox = () => (
  <div className="flex h-full w-full items-center justify-center rounded  text-white shadow">
    <PieChart3d />
  </div>
);

const COMPONENT_MAP = {
  pie: ChartBox,
  geo: TextBox,
  pie3d: ImageBox,
};

export default class DragFromOutsideLayout extends React.Component {
  static defaultProps = {
    className: 'layout',
    rowHeight: 30,
    onLayoutChange: function () {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  };

  state = {
    currentBreakpoint: 'lg',
    compactType: 'vertical',
    mounted: false,
    layouts: { lg: generateLayout() },
    contextMenu: {
      visible: false,
      x: 0,
      y: 0,
      targetId: null,
    },
  };

  componentDidMount() {
    this.setState({ mounted: true });

    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = () => {
    if (this.state.contextMenu.visible) {
      this.setState({
        contextMenu: { visible: false, x: 0, y: 0, targetId: null },
      });
    }
  };

  removeItem = (id) => {
    this.setState((prev) => ({
      layouts: {
        ...prev.layouts,
        lg: prev.layouts.lg.filter((item) => item.i !== id),
      },
      contextMenu: { visible: false, x: 0, y: 0, targetId: null },
    }));
  };

  handleContextMenu = (event, id) => {
    event.preventDefault();
    this.setState({
      contextMenu: {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        targetId: id,
      },
    });
  };

  generateDOM() {
    return _.map(this.state.layouts.lg, (l) => {
      const Component = COMPONENT_MAP[l.type] || (() => <div>Unknown</div>);
      return (
        <div
          key={l.i}
          onContextMenu={(e) => this.handleContextMenu(e, l.i)}
          className={l.static ? 'static' : ''}
        >
          <Component />
        </div>
      );
    });
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({ currentBreakpoint: breakpoint });
  };

  onCompactTypeChange = () => {
    const compactType =
      this.state.compactType === 'horizontal'
        ? 'vertical'
        : this.state.compactType === 'vertical'
          ? null
          : 'horizontal';
    this.setState({ compactType });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout = () => {
    this.setState({ layouts: { lg: generateLayout() } });
  };
  // onResize(layout, oldLayoutItem, layoutItem, placeholder) {
  //   if (layoutItem.h < 3 && layoutItem.w > 2) {
  //     layoutItem.w = 2;
  //     placeholder.w = 2;
  //   }

  //   if (layoutItem.h >= 3 && layoutItem.w < 2) {
  //     layoutItem.w = 2;
  //     placeholder.w = 2;
  //   }
  // }

  onDrop = (layout, layoutItem, event) => {
    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      const newItem = {
        ...layoutItem,
        i: data.i,
        w: data.w,
        h: data.h,
        type: data.type,
      };
      this.setState((prev) => ({
        layouts: {
          ...prev.layouts,
          lg: [...prev.layouts.lg, newItem],
        },
      }));
    } catch (e) {
      console.warn('Invalid drop data', e);
    }
  };

  renderContextMenu() {
    const { visible, x, y, targetId } = this.state.contextMenu;
    if (!visible) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: y,
          left: x,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          zIndex: 9999,
          padding: '4px 0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      >
        <div
          onClick={() => this.removeItem(targetId)}
          className="cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-100"
        >
          Sil
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="flex overflow-hidden">
        <div className="relative h-[80vh] flex-1 overflow-auto border">
          <ResponsiveReactGridLayout
            {...this.props}
            layouts={this.state.layouts}
            onBreakpointChange={this.onBreakpointChange}
            onLayoutChange={this.onLayoutChange}
            onDrop={this.onDrop}
            measureBeforeMount={false}
            useCSSTransforms={this.state.mounted}
            compactType={this.state.compactType}
            preventCollision={!this.state.compactType}
            isDroppable={true}
            isResizable={true}
            isDraggable={true}
            rowHeight={100}
            margin={[10, 10]}
            containerPadding={[10, 10]}
          >
            {this.generateDOM()}
          </ResponsiveReactGridLayout>

          {this.renderContextMenu()}
        </div>
      </div>
    );
  }
}

function generateLayout() {
  const types = ['pie', 'geo', 'pie3d'];
  return _.map(_.range(0, 2), function (i) {
    return {
      x: (i % 3) * 2,
      y: 0,
      w: 2,
      h: 3,
      i: i.toString(),
      type: types[0],
    };
  });
}
