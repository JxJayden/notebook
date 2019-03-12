const ERROR_NAME_REG = /QuotaExceededError|NS_ERROR_DOM_QUOTA_REACHED|QUOTA_EXCEEDED_ERR/i;

export default err => {
  if (ERROR_NAME_REG.test(err.name)) {
    alert('缓存空间不足，请删减笔记～');
  } else {
    alert('操作失败，请退出重试');
  }
};
