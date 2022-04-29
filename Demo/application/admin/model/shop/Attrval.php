<?php

namespace app\admin\model\shop;

use think\Model;


class Attrval extends Model
{

    

    

    // 表名
    protected $name = 'shop_attrval';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'datetime';
    protected $dateFormat = 'Y-m-d H:i:s';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];

    public function attrname()
    {
        return $this->belongsTo('Attrname', 'shop_attrname_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
