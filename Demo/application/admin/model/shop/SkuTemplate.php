<?php

namespace app\admin\model\shop;

use think\Model;


class SkuTemplate extends Model
{

    

    

    // 表名
    protected $name = 'sku_template';
    protected $dateFormat = 'Y-m-d H:i:s';

    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'datetime';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    







}
