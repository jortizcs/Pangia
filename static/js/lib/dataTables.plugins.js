$.fn.dataTableExt.oApi.fnDisplayRow = function ( oSettings, nRow )
{
    var iPos = -1;
    for( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
    {
        if( oSettings.aoData[ oSettings.aiDisplay[i] ].nTr == nRow )
        {
            iPos = i;
            break;
        }
    }
     
    if( iPos >= 0 )
    {
        oSettings._iDisplayStart = ( Math.floor(i / oSettings._iDisplayLength) ) * oSettings._iDisplayLength;
        this.oApi._fnCalculateEnd( oSettings );
    }
     
    this.oApi._fnDraw( oSettings );
}

$.fn.dataTableExt.oApi.fnFindCellRowIndexes = function ( oSettings, sSearch, iColumn )
{
    var
        i,iLen, j, jLen,
        aOut = [], aData;
     
    for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
    {
        aData = oSettings.aoData[i]._aData;
         
        if ( typeof iColumn == 'undefined' )
        {
            for ( j=0, jLen=aData.length ; j<jLen ; j++ )
            {
                if ( aData[j] == sSearch )
                {
                    aOut.push( i );
                }
            }
        }
        else if ( aData[iColumn] == sSearch )
        {
            aOut.push( i );
        }
    }
     
    return aOut;
}
