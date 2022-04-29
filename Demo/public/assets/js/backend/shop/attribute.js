define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {

            /***返回数据到父级页面**** */
            parent.window.$(".layui-layer-iframe").find(".layui-layer-close").on('click',function () {
                            // Fast.api.close("1111");
            });

            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shop/attribute/index' + location.search,
                    add_url: 'shop/attribute/add?category_id='+Config.category_id,
                    edit_url: 'shop/attribute/edit?category_id='+Config.category_id,
                    del_url: 'shop/attribute/del',
                    multi_url: 'shop/attribute/multi',
                    // import_url: 'shop/attribute/import',
                    table: 'shop_attrname',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                queryParams:function(params) {
                    if(Config.category_id){
                        params.filter = `{"shop_category_id":"${Config.category_id}"}`;
                        return params;
                    }
                },
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'category.name', title: __('Shop_category_id')},
                        {field: 'type', title: __('Type'), searchList: {"radio":__('Type radio'),"checkbox":__('Type checkbox')}, formatter: Table.api.formatter.normal},
                        {field: 'is_search', title: __('Is_search'),formatter:Table.api.formatter.toggle},
                        {field: 'is_must', title: __('Is_must'),formatter:Table.api.formatter.toggle},
                        {
                            field: 'operate', 
                            title: __('Operate'), 
                            table: table, 
                            events: Table.api.events.operate, 
                            buttons: [
                                {
                                    name: 'attrval',
                                    title: '属性值',
                                    width:'80%',
                                    classname: 'btn btn-xs btn-success btn-dialog',
                                    icon: 'fa fa-plus',
                                    text:'属性值',
                                    url: function (row, column) {
                                        return 'shop/attrval/index?attribute_id='+row.id;
                                    },
                                    callback: function (data) {
                                        $(".btn-refresh").trigger("click");//刷新当前页面的数据
                                    }
                                },
                            ],
                            formatter: Table.api.formatter.operate
                        },
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false}
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
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
