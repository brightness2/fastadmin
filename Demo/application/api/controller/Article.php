<?php

namespace app\api\controller;

use app\common\controller\Api;

/**
 * 示例接口
 */
class Article extends Api
{

    //如果$noNeedLogin为空表示所有接口都需要登录才能请求
    //如果$noNeedRight为空表示所有接口都需要验证权限才能请求
    //如果接口已经设置无需登录,那也就无需鉴权了
    //
    // 无需登录的接口,*表示全部
    protected $noNeedLogin = ['test','getArticle','getArticles'];
    // 无需鉴权的接口,*表示全部
    protected $noNeedRight = ['test2'];
    /**
     * 权限Auth
     * @var Auth 
     */
    protected $auth = null;
    /**
     * 测试方法
     *
     * @ApiTitle    (测试名称)
     * @ApiSummary  (测试描述信息)
     * @ApiMethod   (POST)
     * @ApiRoute    (/api/demo/test/id/{id}/name/{name})
     * @ApiHeaders  (name=token, type=string, required=true, description="请求的Token")
     * @ApiParams   (name="id", type="integer", required=true, description="会员ID")
     * @ApiParams   (name="name", type="string", required=true, description="用户名")
     * @ApiParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据")
     * @ApiReturnParams   (name="code", type="integer", required=true, sample="0")
     * @ApiReturnParams   (name="msg", type="string", required=true, sample="返回成功")
     * @ApiReturnParams   (name="data", type="object", sample="{'user_id':'int','user_name':'string','profile':{'email':'string','age':'integer'}}", description="扩展数据返回")
     * @ApiReturn   ({
         'code':'1',
         'msg':'返回成功'
        })
     */
    /**
     * 无需登录的接口
     *
     */
    public function test()
    {
        $this->success('返回成功', $this->request->param());
    }


    /**
     * 需要登录的接口
     *
     */
    public function test2()
    {
        $this->success('返回成功', ['action' => 'test2']);
    }

    /**
     * 需要登录且需要验证有相应组的权限
     *
     */
    public function getArticle()
    {
        $id = $this->request->post('id');
        if (!$id) {
            $this->error(__('Invalid parameters'));
        }
        $row = \app\admin\model\article\Article::find($id);
        $this->success('article',$row);
    }

    public function getArticles()
    {
        $rows = \app\admin\model\article\Article::field(['id','title'])->select();
        $this->success('articles', $rows);
    }

}
