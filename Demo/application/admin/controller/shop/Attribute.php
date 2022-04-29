<?php

namespace app\admin\controller\shop;

use app\common\controller\Backend;

/**
 * 属性管理
 *
 * @icon fa fa-circle-o
 */
class Attribute extends Backend
{

    /**
     * Attrname模型对象
     * @var \app\admin\model\shop\Attrname
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shop\Attrname;
        $this->view->assign("typeList", $this->model->getTypeList());
    }



    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */

    public function index()
    {
       
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();

            $list = $this->model
                    ->with(['category'])
                    ->where($where)
                    ->order($sort, $order)
                    ->paginate($limit);
            foreach ($list as $row) {
                $row->getRelation('category')->visible(['id','name']);
            }
            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        
        $category_id = $this->request->get('category_id');
        if(!$category_id){
            $this->error('缺少分类id');
        }
        $this->assignconfig('category_id',$category_id);
        return $this->view->fetch();
    }
    
    public function add()
    {
        $category_id = $this->request->get('category_id');
        if(!$category_id){
            $this->error('缺少分类id');
        }
        $this->assign('category_id',$category_id);
        
        return parent::add();
    }

    /**
     * 根据分类获取所有属性值
     *
     * @return void
     */
    public function attrs()
    {
        if(!$this->request->isAjax()) $this->error("该接口没有编写页面");
        $category_id = $this->request->param('category_id');
        if(!$category_id){
            return $this->error("缺少category_id参数");;
        }
        $list = $this->model
             ->with(['attrval'])
             ->where('shop_category_id',$category_id)
             ->select();
             
        $result = array("total" => count($list), "rows" => $list);
        return json($result);
    }
}
