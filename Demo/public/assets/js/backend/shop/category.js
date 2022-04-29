define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'shop/category/index' + location.search,
                    add_url: 'shop/category/add',
                    edit_url: 'shop/category/edit',
                    del_url: 'shop/category/del',
                    multi_url: 'shop/category/multi',
                    import_url: 'shop/category/import',
                    table: 'shop_category',
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
                escape: false,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'parent.name', title: __('Pid')},
                        {field: 'name', title: __('Name'), operate: 'LIKE',align: 'left',formatter: Controller.api.formatter.title},
                        {field: 'flag', title: __('Flag'), searchList: {"hot":__('Flag hot'),"index":__('Flag index'),"recommend":__('Flag recommend')}, operate:'FIND_IN_SET', formatter: Table.api.formatter.label},
                        {field: 'icon', title: __('Icon'), operate: 'LIKE', formatter: Controller.api.formatter.icon},
                        {field: 'url', title: __('Url'), operate: 'LIKE', formatter: Controller.api.formatter.url},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'isnav', title: __('Isnav'),formatter: Table.api.formatter.toggle},
                        {field: 'weigh', title: __('Weigh'), operate: false},
                        {field: 'status', title: __('Status'), searchList: {"1":__('Status 1'),"0":__('Status 0')}, formatter: Table.api.formatter.status},
                        {
                            field: 'operate', 
                            title: __('Operate'), 
                            table: table, 
                            events: Table.api.events.operate, 
                            buttons: [
                                {
                                    name: 'attribute',
                                    title: '商品属性',
                                    width:'80%',
                                    classname: 'btn btn-xs btn-success btn-dialog',
                                    icon: 'fa fa-plus',
                                    text:'商品属性',
                                    url: function (row, column) {
                                        return 'shop/attribute/index?category_id='+row.id;
                                    },
                                    callback: function (data) {
                                        $(".btn-refresh").trigger("click");//刷新当前页面的数据
                                        // console.error(data);//控制输出回调数据
                                    }
                                },
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
                icon: function (value, row, index) {
                    return '<span class="' + (!row.isnav || row.status == 'hidden' ? 'text-muted' : '') + '"><i class="' + value + '"></i></span>';
                },
                title: function (value, row, index) {
                    value = value.toString().replace(/(&|&amp;)nbsp;/g, '&nbsp;');
                    return !row.ismenu || row.status == 'hidden' ? "<span class='text-muted'>" + value + "</span>" : value;
                },
            },
            bindevent: function () {
                
                Form.api.bindevent($("form[role=form]"));
                /**
                 * 图标搜索 开始
                 */
                var iconlist = [];
                //打开图标模板页面
                var iconfunc = function () {
                    Layer.open({
                        type: 1,
                        area: ['99%', '98%'], //宽高
                        content: Template('chooseicontpl', {iconlist: iconlist})
                    });
                };
                //icon input 内容变动事件
                $(document).on('change keyup', "#icon", function () {
                    $(this).prev().find("i").prop("class", $(this).val());
                });
                //图标搜索按钮点击事件
                $(document).on('click', ".btn-search-icon", function () {
                    if (iconlist.length == 0) {
                        $.get(Config.site.cdnurl + "/assets/libs/font-awesome/less/variables.less", function (ret) {
                            var exp = /fa-var-(.*):/ig;
                            var result;
                            while ((result = exp.exec(ret)) != null) {
                                iconlist.push(result[1]);
                            }
                            iconfunc();
                        });
                    } else {
                        iconfunc();
                    }
                });
                //图标模板中的图标点击事件
                $(document).on('click', '#chooseicon ul li', function () {
                    $("input[name='row[icon]']").val('fa fa-' + $(this).data("font")).trigger("change");
                    Layer.closeAll();
                });
                //图标模板中的搜索input 输入事件，进行图标筛选
                $(document).on('keyup', 'input.js-icon-search', function () {
                    $("#chooseicon ul li").show();
                    if ($(this).val() != '') {
                        $("#chooseicon ul li:not([data-font*='" + $(this).val() + "'])").hide();
                    }
                });
                /**
                 * 图标搜索 结束
                 */
            }
        }
    };
    return Controller;
});
