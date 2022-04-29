<?php

namespace app\admin\model\shop;

use think\Model;


class Attrname extends Model
{

    

    

    // 表名
    protected $name = 'shop_attrname';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'datetime';
    protected $dateFormat = 'Y-m-d H:i:s';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [
        'type_text'
    ];
    

    
    public function getTypeList()
    {
        return ['radio' => __('Type radio'), 'checkbox' => __('Type checkbox')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function category()
    {
       return $this->belongsTo(Category::class,'shop_category_id','id',[],'left')->setEagerlyType(0);
    }

    public function attrval()
    {
        return $this->hasMany(Attrval::class,'shop_attrname_id','id',[],'left');
    }
}
