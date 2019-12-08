import axios from 'axios'
import inventory from '../assets/jsons/inventory.json';
import product from '../assets/jsons/products.json';
import branchLocation from '../assets/jsons/branchesLocation.json';
import suppliers from '../assets/jsons/suppliers.json';
import getInventory from '../assets/jsons/getInventoryById.json';
import getBrands from '../assets/jsons/brands.json';
import getBills from '../assets/jsons/bills.json';
import getCharts from '../assets/jsons/overAllViewChart.json';
import agentChart from '../assets/jsons/agentDistribution.json';
import getRecentUpdates from '../assets/jsons/recentUpdates.json';
import getBillQuote from '../assets/jsons/getBillByID.json';

export default class httpServiceLayer {

  constructor() {
    this.ax = axios.create({
      baseURL: 'https://bapp-be.herokuapp.com/bApp/services'
    });
  }
  commonHttpPostService(URL, inputRequest) {
    try {
      try {
        return this.ax.post(URL, inputRequest);
      }
      catch (error) {
        this.handleError(error);
      }
    } catch (error) {
      console.log(error)
    }
  }

  commonHttpGetService(URL) {
    try {
      try {
        return this.ax.get(URL);
      }
      catch (error) {
        this.handleError(error);
      }
    } catch (error) {
      console.log(error)
    }
  }


  handleError(error) {
    try {
      console.log("got a error ", error);
      if (error.networkError.statusCode === 401 || error.networkError.statusCode === 405) {
        this.props.history.push('/login');
      }
    } catch (error) {
      console.log(error)
    }
  }
  jsonFetch(url) {
    try {
      switch (url) {
        case 'inventory':
          return inventory;
        case 'product':
          return product;
        case 'suppliers':
          return suppliers;
        case 'branchLocation':
          return branchLocation;
        case 'getInventoryItem':
          return getInventory;
        case 'getBrands':
          return getBrands;
        case 'getBillQuote':
          return getBillQuote;
        case 'getBills':
          return getBills;
        case 'getCharts':
          return getCharts;
        case 'agentChart':
          return agentChart;
        case 'getRecentUpdates':
          return getRecentUpdates;
        default:
          break;
      }
    } catch (error) {

    }
  }

}