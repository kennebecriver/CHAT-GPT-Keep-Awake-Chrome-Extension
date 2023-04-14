chrome.windows.getAll({ populate: true }, function(windows) {
  const tabList = document.getElementById('tab-list');
  windows.forEach(function(window) {
    window.tabs.forEach(function(tab) {
      const tabItem = document.createElement('li');
      const tabLink = document.createElement('a');
      tabLink.href = tab.url;
      tabLink.innerText = tab.title;
      tabItem.appendChild(tabLink);
      tabList.appendChild(tabItem);
    });
  });
});
