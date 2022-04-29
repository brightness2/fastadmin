<?php

namespace app\admin\controller\shop;

use app\common\controller\Backend;

/**
 * 前台菜单
 *
 * @icon fa fa-circle-o
 */
class FrontMenu extends Backend
{

    /**
     * FrontMenu模型对象
     * @var \app\admin\model\shop\FrontMenu
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\shop\FrontMenu;

    }

    /**
     * 查看
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
                    ->with(['parent'])
                    ->where($where)
                    ->order($sort, $order)
                    ->paginate($limit);

            foreach ($list as $row) {
                $row->getRelation('parent')->visible(['id','name']);
            }

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }

    /**
     * 添加
     */
    public function add()
    {
        $list = $this->model->column('id,name');
        $this->view->assign('MenuList', build_select('row[pid]', $list, [], ['class' => 'form-control']));
        return parent::add();
    }

     /**
     * 编辑
     */
    public function edit($ids = null)
    {
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $list = $this->model->where('id','<>',$ids)->column('id,name');
        $this->view->assign('MenuListSelect', build_select('row[pid]', $list, $row['pid'], ['class' => 'form-control']));
        return parent::edit($ids);
    }
}
