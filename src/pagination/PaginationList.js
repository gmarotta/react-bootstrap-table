import React, { Component, PropTypes } from 'react';
import PageButton from './PageButton.js';
import Const from '../Const';

class PaginationList extends Component {

  changePage = page => {
    const { prePage, currPage, nextPage, lastPage, firstPage, sizePerPage } = this.props;
    if (page === prePage) {
      page = currPage - 1 < 1 ? 1 : currPage - 1;
    } else if (page === nextPage) {
      page = currPage + 1 > this.totalPages ? this.totalPages : currPage + 1;
    } else if (page === lastPage) {
      page = this.totalPages;
    } else if (page === firstPage) {
      page = 1;
    } else {
      page = parseInt(page, 10);
    }

    if (page !== currPage) {
      this.props.changePage(page, sizePerPage);
    }
  }

  changeSizePerPage = e => {
    e.preventDefault();

    const selectSize = parseInt(e.currentTarget.text, 10);
    let { currPage } = this.props;
    if (selectSize !== this.props.sizePerPage) {
      this.totalPages = Math.ceil(this.props.dataSize / selectSize);
      if (currPage > this.totalPages) currPage = this.totalPages;

      this.props.changePage(currPage, selectSize);
      if (this.props.onSizePerPageList) {
        this.props.onSizePerPageList(selectSize);
      }
    }
  }

  changePageHandler = e => {
    e.preventDefault();

    const { dataSize, sizePerPage } = this.props;
    const totalPages = Math.ceil(dataSize / sizePerPage);

    const val = e;
    if (val <= totalPages ) {
      this.changePage(val);
    }
  };

  nextPage = e => {
    e.preventDefault();
    this.changePage('>');
  };

  lastPage = e => {
    e.preventDefault();
    this.changePage('>>');
  };

  previousPage = e => {
    e.preventDefault();
    this.changePage('<');
  };

  firstPage = e => {
    e.preventDefault();
    this.changePage('<<');
  };

  render() {
    const { dataSize, sizePerPage, sizePerPageList } = this.props;
    this.totalPages = Math.ceil(dataSize / sizePerPage);

    const sizePerPageOptions = sizePerPageList.map((_sizePerPage) => {
      return (
        <li key={ _sizePerPage } role='presentation'>
          <a role='menuitem'
            tabIndex='-1' href='#'
            onClick={ this.changeSizePerPage }>{ _sizePerPage }</a>
        </li>
      );
    });

    return (
          <nav className='navbar adp-table-nav'>
            <div className='container-fluid'>
              <div className='navbar-collapse collapse adp-table-pagination'>

                <ul className='nav navbar-nav navbar-right'>
                  <li className='active'>
                    <div className='prev-pages'>
                      <ul>
                        <li>
                          <button onClick={ this.firstPage } className='btn btn-default btn-first-page'>
                            <i className='icon-pagination-first'></i>
                          </button>
                        </li>
                        <li>
                          <button onClick={ this.previousPage } className='btn btn-default btn-prev-page'>
                            <i className='icon-pagination-previous'></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div className='adp-pagination-input'>
                      <input type='number' role='textbox' min='1' max={ this.totalPages } className='current-start-page' value={ this.props.currPage } onChange={ this.changePageHandler }/>
                    </div>
                  </li>
                  <li>
                    <p className='adp-page-indicator'> of <span className='total-pages'>{ this.totalPages }</span></p>
                  </li>
                  <li>
                    <div className='next-pages'>
                      <ul>
                        <li>
                          <button onClick={ this.nextPage } className='btn btn-default btn-next-page'>
                            <i className='icon-pagination-next'></i>
                          </button>
                        </li>
                        <li>
                          <button onClick={ this.lastPage } className='btn btn-default btn-last-page'>
                            <i className='icon-pagination-last'></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>

                <div className='rows-per-page-select pull-right'>
                  <label className='pull-left'>Rows per page</label>
                  <div className='dropdown adp-dropdown btn-group pull-left' data-selectable='true'>
                    <button type='button' className='ui-select-container btn' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      <span className='selected-item'>{ sizePerPage }</span><span className='caret'></span>
                    </button>
                    <ul className='dropdown-menu' role='menu'>
                      { sizePerPageOptions }
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </nav>
    );
  }

  makePage() {
    const pages = this.getPages();
    return pages.map(function(page) {
      const isActive = page === this.props.currPage;
      let disabled = false;
      let hidden = false;
      if (this.props.currPage === 1 &&
        (page === this.props.firstPage || page === this.props.prePage)) {
        disabled = true;
        hidden = true;
      }
      if (this.props.currPage === this.totalPages &&
        (page === this.props.nextPage || page === this.props.lastPage)) {
        disabled = true;
        hidden = true;
      }
      return (
        <PageButton key={ page }
          changePage={ this.changePage }
          active={ isActive }
          disable={ disabled }
          hidden={ hidden }>
          { page }
        </PageButton>
      );
    }, this);
  }

  getPages() {
    let pages;
    let startPage = 1;
    let endPage = this.totalPages;

    startPage = Math.max(this.props.currPage - Math.floor(this.props.paginationSize / 2), 1);
    endPage = startPage + this.props.paginationSize - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = endPage - this.props.paginationSize + 1;
    }

    if (startPage !== 1 && this.totalPages > this.props.paginationSize) {
      pages = [ this.props.firstPage, this.props.prePage ];
    } else if (this.totalPages > 1) {
      pages = [ this.props.prePage ];
    } else {
      pages = [];
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0) pages.push(i);
    }

    if (endPage !== this.totalPages) {
      pages.push(this.props.nextPage);
      pages.push(this.props.lastPage);
    } else if (this.totalPages > 1) {
      pages.push(this.props.nextPage);
    }
    return pages;
  }
}
PaginationList.propTypes = {
  currPage: PropTypes.number,
  sizePerPage: PropTypes.number,
  dataSize: PropTypes.number,
  changePage: PropTypes.func,
  sizePerPageList: PropTypes.array,
  paginationSize: PropTypes.number,
  remote: PropTypes.bool,
  onSizePerPageList: PropTypes.func,
  prePage: PropTypes.string
};

PaginationList.defaultProps = {
  sizePerPage: Const.SIZE_PER_PAGE
};

export default PaginationList;
