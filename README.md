# Worker
# 工具
## webpack + TypeScript

# 进度
1. Jsonp请求的hack：在添加带有src属性的script元素时拦截，并将相关信息发送给Render（还不够严谨）
2. sendBeacon，xhr,fetch的hack：直接将参数拦截下来，转发给Render；XHR比较特别……
