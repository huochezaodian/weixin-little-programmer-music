/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)
// 热歌榜
router.get('/hotMusic', controllers.music.hot)
// 新歌榜
router.get('/newMusic', controllers.music.new)
// 搜索歌曲
router.get('/searchMusic', controllers.music.search)
// 歌曲vkey
router.get('/vkeyMusic', controllers.music.vkey)
// 歌曲lrc
router.get('/lrcMusic', controllers.music.lrc)

module.exports = router
