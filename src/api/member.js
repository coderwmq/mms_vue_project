import request from '@/utils/request'


// 查询全部会员信息
export function getMemberList() {
  return request({
    url: '/member/list',
    method: 'get'
  })
}
// 会员信息分页
export function search(page,size,searchMap) {
  return request({
    url: `/member/search/${page}/${size}`,
    method: 'post',
    data:{
      searchMap
    }
  })
}
// 新增会员
export function addMember(pojo) {
  return request({
    url: `/member`,
    method: 'post',
    data:pojo
    
  })
}
// 根据id查询会员
export function queryMemberById(id) {
  return request({
    url: `/member/${id}`,
    method: 'get',
  })
}
// 更新会员
export function updateMember(pojo) {
  return request({
    url: `/member/${pojo.id}`,
    method: 'put',
    data: pojo
    
  })
}
// 删除会员
export function delMemberById(id) {
  return request({
    url: `/member/${id}`,
    method: 'delete',
  })
}