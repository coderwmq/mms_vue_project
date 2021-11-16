import request from '@/utils/request'

export default {
  // 通过id删除员工
  deleteById(id) {
    return request({
      url: `/staff/${id}`,
      method: 'delete'
    })
  },
  // 通过id查询员工信息
  getById(id) {
    return request({
      url: `/staff/${id}`,
      method: 'get'
    })
  },
  // 更新数据
  updateStaff(pojo) {
    return request({
      url: `/staff/${pojo.id}`,
      method: 'put',
      data: pojo
    })
  },
  // 添加员工
  addStaff(pojo) {
    return request({
      url: '/staff',
      method: 'post',
      data: pojo
    })
  },
  // 分页查询
  search(page, size, searchMap) {
    return request({
      url: `/staff/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
}