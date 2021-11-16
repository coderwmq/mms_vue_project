import request from "@/utils/request";

export default {
  // 商品更新
  updateGoods(pojo) {
    return request({
      url: `/goods/${pojo.id}`,
      method: 'put',
      data: pojo
    })
  },
  // id查询商品
  queryGoodsById(id) {
    return request({
      url: `/goods/${id}`,
      method: 'get',
    })
  },
  // 新增商品
  addGoods(pojo) {
    return request({
      url: `/goods`,
      method: 'post',
      data: pojo
    })
  },
  // id删除
  delGood(id) {
    return request({
      url: `/goods/${id}`,
      method: 'delete'
    })
  },
  // 查询
  search(page, size, searchMap) {
    return request({
      url: `/goods/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
}