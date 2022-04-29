<?php

namespace app\admin\model\shop;

use think\Model;


class FrontMenu extends Model
{

    

    

    // 表名
    protected $name = 'front_menu';
    
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
    

    protected static function init()
    {
        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }

    /**
     * 自关联
     *
     * @return void
     */
    public function parent()
    {
        return $this->belongsTo('\app\admin\model\shop\FrontMenu', 'pid', 'id',[],'left')->setEagerlyType(0);
    }


}
