window.addEventListener("load", async function () {
    const avatar = document.querySelector('#avatar');
    const username = document.querySelector('#username');
    const lineTitle = document.querySelector('#line-title')
    const articlesContainer = document.querySelector('.articles-container');

    async function init() {
        const promiseRes = await fetch('/api/user-info');
        const data = await promiseRes.json();
        if (data.isLoggedIn) {
            avatar.src = data.path;
            username.textContent = data.username;
        } else {
            alert('You my need log in first.')
            window.location.href = '/'
        }
    }

    async function loadMyOwnArticles() {
        const promiseRes = await fetch('/articles/api/get-my-articles',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await promiseRes.json();
        const articles = data.articles;
        lineTitle.textContent = 'My Articles';
        generateArticleBlock(articles);
    }

    function generateArticleBlock(articles) {
        if (articles.length > 0) {
            articles.forEach(article => {
                const singleArticle = document.createElement('div');
                const titleWrapper = document.createElement('a');
                const timeWrapper = document.createElement('div');

                singleArticle.classList.add('single-article-wrapper')

                titleWrapper.textContent = article.title;
                const from = window.location.search;
                if(isMyArticles){
                    titleWrapper.href = `/articles/my-articles/${article.id}${from}`;
                }else {
                    titleWrapper.href = `/articles/my-likes/${article.id}${from}`;
                }

                console.log(window.location.search)
                titleWrapper.classList.add('title-wrapper');

                timeWrapper.textContent = article.updated_time;
                timeWrapper.classList.add('time-wrapper');

                singleArticle.append(titleWrapper, timeWrapper)
                articlesContainer.appendChild(singleArticle);
            })
        }
    }

    async function loadMyLikeArticles(){
        const promiseRes = await fetch('/articles/api/get-my-likes',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await promiseRes.json();
        const articles = data.articles;
        lineTitle.textContent = 'My Likes';
        generateArticleBlock(articles);
    }

    await init();
    const isMyArticles = articlesContainer.dataset.type === 'my'
    if(isMyArticles){
        await loadMyOwnArticles();
    }else {
        await loadMyLikeArticles();
    }

})