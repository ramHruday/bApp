import React, { Component } from 'react';
import httpServiceLayer from '../services/http-service-layer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactEcharts from 'echarts-for-react';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.state = {
            overAllChart: {},
            agentChart: {},
            recentUpdates: [],
            opacity: {
                sales: 1,
                debt: 1,
                purchase: 1,
            },
        };
        this.services = new httpServiceLayer();
    }

    handleMouseEnter(o) {
        const { dataKey } = o;
        const { opacity } = this.state;

        this.setState({
            opacity: { ...opacity, [dataKey]: 0.2 },
        });
    }

    handleMouseLeave(o) {
        const { dataKey } = o;
        const { opacity } = this.state;

        this.setState({
            opacity: { ...opacity, [dataKey]: 1 },
        });
    }
    componentDidMount() {
        this.getCharts();
    }
    getCharts() {
        let jsonResponse = this.services.jsonFetch('getCharts')['data']['overAllChart'];
        let recentUpdatesJson = this.services.jsonFetch('getRecentUpdates')['data'];
        let agentJsonDistribution = this.services.jsonFetch('agentChart')['data'];

        this.setState({
            overAllChart: jsonResponse,
            agentChart: agentJsonDistribution,
            recentUpdates: recentUpdatesJson
        })
    }
    isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
    getOverAllChartOptions() {
        let option = {
            color: ['#003366', '#006699', '#4cabce', '#e5323e'],
            tooltip: {
                trigger: 'axis',
                // axisPointer: {
                //     type: 'shadow'
                // }
                backgroundColor: "#020000"
            },
            legend: {
                data: ['Sales', 'Purchase', 'Debt', 'Total']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                top: 'center',
                right: '1%',
                itemGap: 20,
                feature: {
                    restore: { show: true, title: 'restore' },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled', 'scatter'], title: { line: 'Line', bar: 'Bar', stack: 'pair-stack', tiled: 'pair-tiles' } },
                    saveAsImage: { show: true, title: 'download' }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: this.state.overAllChart.xAxis
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Sales',
                    type: 'bar',
                    barGap: 0,
                    data: this.state.overAllChart.sales
                },
                {
                    name: 'Purchase',
                    type: 'bar',
                    data: this.state.overAllChart.purchase
                },
                {
                    name: 'Debt',
                    type: 'bar',
                    data: this.state.overAllChart.debt
                },
                {
                    name: 'Total',
                    type: 'line',
                    data: this.state.overAllChart.total
                }
            ]
        };
        return option;
    }
    getAgentChartsOptions() {
        let option = {
            color: this.state.agentChart.colorPallette,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: this.state.agentChart.xAxis,
                show: false
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                top: 'center',
                right: '1%',
                itemGap: 20,
                feature: {
                    saveAsImage: { show: true, title: 'download' },
                }
            },
            series: [
                {
                    name: '6 months',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '50%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: this.state.agentChart.agentDistributionThreeMonths
                },
                {
                    name: '1 year',
                    type: 'pie',
                    radius: ['70%', '90%'],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    data: this.state.agentChart.agentDistributionOneYear
                }
            ]
        };
        return option;
    }
    render() {
        const recentUpdatesConst = this.state.recentUpdates.map((update, i) =>
            <div className="border-card p-2" key={i+"_1"}>
                <span className="p-2">
                    {(update.msgType === 'inventory_alert' && <i className="fas fa-fw fa-exclamation-triangle warning"></i>)
                        ||
                        (update.msgType === 'inventory_danger' && <i className="fas fa-fw fa-business-time danger"></i>)
                        ||
                        (update.msgType === 'inventory_success' && <i className="fas fa-fw fa-business-time full"></i>)
                        ||
                        (update.msgType === 'sales_success' && <i className="fas fa-fw fa-shipping-fast full"></i>)
                        ||
                        (update.msgType === 'sales_danger' && <i className="fas fa-fw fa-frown-open danger"></i>)
                        ||
                        (update.msgType === 'sales_alert' && <i className="fas fa-fw fa-exclamation-triangle warning"></i>)
                        ||
                        (update.msgType === 'agent_danger' && <i className="fas fa-fw fa-user-ninja danger"></i>)
                        ||
                        (update.msgType === 'agent_success' && <i className="fas fa-fw fa-user-ninja full"></i>)
                        ||
                        (update.msgType === 'agent_alert' && <i className="fas fa-fw fa-user-ninja warning"></i>)                        
                    }
                </span>
                <span className="p-2">
                    {update.message}
                    {update.msgLink &&
                        <a href={update.msgLink}><i class="fas fa-external-link-alt float-right"></i></a>}
                </span>
            </div>

        );
        return (

            <div className="container-fluid">

                <React.Fragment>
                    <Row>
                        <Col sm={12} className="p-2">
                            {this.state && this.state.overAllChart &&
                                <div className="dash-card card p-3 overflow-auto">
                                    <h5 className="p-2">
                                        Sales/Purchase/Debt - <span className="small">last 6 months</span> <a className="float-right blue-more small" href="/more-on-sales">more <i className="fas fa-fw fa-angle-right"></i></a>
                                    </h5>

                                    {/* overAll charts */}
                                    <ReactEcharts
                                        option={this.getOverAllChartOptions()}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"} />
                                </div>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={5} className="p-2">
                            {this.state && this.state.agentChart &&
                                <div className="dash-card card p-3">
                                    <h5 className="p-2">
                                        Agent wise distribution- <span className="small">6 months & 1 year</span> <a className="float-right blue-more small" href="/billing">more <i class="fas fa-angle-right"></i></a>
                                    </h5>
                                    <ReactEcharts
                                        option={this.getAgentChartsOptions()}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"} />
                                </div>
                            }
                        </Col>
                        <Col sm={7} className="p-2">
                            <div className="dash-card card p-3">
                                <h5 className="p-2">
                                    Recent Updates
                            </h5>
                                {recentUpdatesConst}
                                {/* <div className="border-card p-2">
                                    <span className="p-2">
                                        <i className="fas fa-fw fa-exclamation-triangle warning"></i>
                                    </span>
                                    <span className="p-2">

                                    </span>
                                </div>
                                <div className="border-card p-2">
                                    <span className="p-2">
                                        <i class="fas fa-fw fa-exclamation danger faa-wrench animated"></i>
                                    </span>
                                    <span className="p-2">

                                    </span>
                                </div>
                                <div className="border-card p-2">
                                    <span className="p-2">
                                        <i class="fas fa-fw fa-shipping-fast full"></i>
                                    </span>
                                    <span className="p-2">

                                    </span>
                                </div>
                                <div className="border-card p-2">
                                    <span className="p-2">
                                        <i class="fas fa-fw fa-user-ninja full"></i>
                                    </span>
                                    <span className="p-2">

                                    </span>
                                </div>
                                <div className="border-card p-2">
                                    <span className="p-2">
                                        <i class="fas fa-fw fa-business-time warning"></i>
                                    </span>
                                    <span className="p-2">
                                        Attention Needed for Inventory set-up ! <i class="fas fa-external-link-alt float-right"></i>
                                    </span>
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                </React.Fragment>
            </div>
        )
    }
}
