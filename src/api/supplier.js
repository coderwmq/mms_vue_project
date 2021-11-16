import request from "@/utils/request";

export default {
  // 供应商信息更新
  updateSup(pojo) {
    return request({
      url: `/supplier/${pojo.id}`,
      method: 'put',
      data: pojo
    })
  },
  // id查询供应商信息
  querySupById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'get',
    })
  },
  // 新增供应商信息
  addSupplier(pojo) {
    return request({
      url: '/supplier',
      method: 'post',
      data: pojo
    })
  },
  // 查询所有供应商信息
  getAllSuppliers() {
    return request({
      url: '/supplier/list',
      method: 'get'
    })
  },
  // 分页查询供应商信息
  search(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  // 分页查询供应商信息
  delSupById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'delete',
    })
  }
}