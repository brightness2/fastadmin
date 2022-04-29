define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shop/goods/index' + location.search,
                    add_url: 'shop/goods/add',
                    edit_url: 'shop/goods/edit',
                    del_url: 'shop/goods/del',
                    multi_url: 'shop/goods/multi',
                    import_url: 'shop/goods/import',
                    table: 'shop_goods',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'category.name', title: __('Shop_category_id')},
                        // {field: 'subtitle', title: __('Subtitle'), operate: 'LIKE'},
                        // {field: 'shop_attrval_ids', title: __('Shop_attrval_ids'), operate: 'LIKE'},
                        {field: 'goods_sn', title: __('Goods_sn'), operate: 'LIKE'},
                        {field: 'title', title: __('Title'), operate: 'LIKE'},
                        {field: 'url', title: __('Url'),formatter:Controller.api.formatter.url},
                        // {field: 'keywords', title: __('Keywords'), operate: 'LIKE'},
                        // {field: 'description', title: __('Description'), operate: 'LIKE'},
                        {field: 'marketprice', title: __('Marketprice'), operate:'BETWEEN'},
                        {field: 'price', title: __('Price'), operate:'BETWEEN'},
                        {field: 'stocks', title: __('Stocks')},
                        {field: 'sales', title: __('Sales')},
                        // {field: 'star', title: __('Star')},
                        {field: 'views', title: __('Views')},
                        {field: 'comments', title: __('Comments')},
                        // {field: 'shares', title: __('Shares')},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'images', title: __('Images'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'corner', title: __('Corner'), operate: 'LIKE'},
                        {field: 'flag', title: __('Flag'), searchList: {"recommend":__('Flag recommend'),"hot":__('Flag hot'),"new":__('Flag new'),"best":__('Flag best'),"index":__('Flag index')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        // {field: 'spectype', title: __('Spectype')},
                        {field: 'weight', title: __('Weight'), operate:'BETWEEN'},
                        // {field: 'virtualswitch', title: __('Virtualswitch'), table: table, formatter: Table.api.formatter.toggle},
                        {field: 'weigh', title: __('Weigh'), operate: false},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Status normal'),"hidden":__('Status hidden'),"soldout":__('Status soldout')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'shop/goods/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title'), align: 'left'},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'shop/goods/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'shop/goods/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },

        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            formatter:{
                url:function (value,row,index){
                    if(value){
                        return `<a href="${value}" target="_blank" class="btn btn-default btn-xs"><i class="fa fa-link"></i></a>`;
                    }
                },
            },
            bindevent: function () {
                //类别 下拉框
                $(document).on("change", "#c-shop_category_id", function(e){
                    //加载属性值
                    let category_id = $(this).val();
                    if(!category_id) return;
                    $.ajax({
                        type: "post",
                        url: "shop/attribute/attrs",
                        data: {category_id},
                        dataType: "json",
                        success: function (response) {
                            let rows = response.rows;
                            Controller.buildAttr(rows);
                        }
                    });
                });
                Form.api.bindevent($("form[role=form]"));

            }
        },
        buildAttr(data){
            
            if(Array.isArray(data)&&data.length>0){

                /**表单项 */
                function item(row,count){
                    if(row.attrval.length<=0) return;
                    let tpl = `<div class="form-group">`;
                    tpl += `<label class="control-label col-xs-12 col-sm-2">${row.name}:</label>`;
                    tpl += `<div class="col-xs-12 col-sm-8">`;
                    if('checkbox' == row.type){
                       
                    }else{
                        tpl += `<div class="radio">`;
                        row.attrval.forEach(el => {
                            tpl += `
                                <label>
                                    <input id="row[shop_attrval_ids][${count}][]-${el.id}" data-rule="" name="row[attribute_ids][${count}][]" type="radio" value="${el.id}">
                                    ${el.name}
                                </label>
                            `;
                        });
                        tpl += `</div>`;
                    }
                    tpl += `</div>`;
                    tpl += `</div>`;
                    return tpl;
                }

                let t = ``;
                let count = 0;
                for (const key in data) {
                    count++;
                    const row = data[key];
                    t += item(row,count);
                }
                $('#attributes').html(t);
            }
        }
    };
    return Controller;
});
