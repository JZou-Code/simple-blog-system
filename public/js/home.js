window.addEventListener("load", async function () {
// ==============begin===============
// Load articles, 10 articles for one loading.
    let lastArticleId = 0;
    const bottomMessage = document.querySelector('#bottom-message')
    const lineArea = document.querySelector('.line-area')
    const container = document.querySelector('#article-container');
    const displayedTextareaNodes = [];
    const commentArticleMap = new Map();
    const allArticles = [];

    const avatar = document.querySelector('#avatar');
    const loadMore = document.querySelector('#load-more');
    const isSingleArticle = document.querySelector('#mark-single');
    let username = '';
    let userId = 0;

    try {
        const promiseRes = await fetch('/api/user-info');
        const data = await promiseRes.json();

        if (avatar) {
            avatar.src = data.path;
            username = data.username;
        }
        userId = data.userId;

        if (isSingleArticle) {
            const sorter = document.querySelector('.sort-area');
            sorter.style.display = 'none'
            loadMore.style.display = 'none'
            await loadSingleArticle();
            generateFunction();
        } else {
            loadNewArticles();
            loadMore.addEventListener('click', loadNewArticles);
        }
    } catch (err) {
        console.log('Get avatar path err', err)
    }


    async function loadNewArticles() {
        let articles = [];
        let comments = [];
        let likes = new Map();
        let likeStates = [];

        const promiseRes = await fetch(`/articles/api/get-new?id=${lastArticleId}`);
        const data = await promiseRes.json()
        articles = data.articles;
        comments = data.comments;
        likes = data.likes;
        likeStates = data.likeStates;

        console.log(articles)

        if (articles.length < 10) {
            bottomMessage.textContent = 'No more articles to load'
            loadMore.classList.add('disappear')
            lineArea.classList.remove('disappear')
        }

        if (articles.length === 0) {
            return
        }

        generateArticleBlock(articles, comments, likes, likeStates)

        lastArticleId = articles[articles.length - 1].id
    }

    async function loadSingleArticle() {
        let articles = [];
        let comments = [];
        let likes = new Map();
        let likeStates = [];

        const pagePath = window.location.pathname;
        const pagePathArr = pagePath.split('/')
        const articleId = pagePathArr[pagePathArr.length - 1]

        const promiseRes = await fetch(`/articles/api/get-single?id=${articleId}`);
        const data = await promiseRes.json()

        articles = data.articles;
        comments = data.comments;
        likes = data.likes;
        likeStates = data.likeStates;

        generateArticleBlock(articles, comments, likes, likeStates)
    }

    // Extract same codes as a separate function
    function generateArticleBlock(articles, comments, likes, likeStates) {
        for (let i = 0; i < articles.length; i++) {
            const newArticleBlock = document.createElement('div');
            newArticleBlock.classList.add('article')
            newArticleBlock.dataset.articleId = articles[i].id;
            newArticleBlock.dataset.isAuthor = articles[i].user_id === userId ? 'true' : 'false';

            const newBody = generateBody(articles[i]);

            comments[i].forEach(comment => {
                commentArticleMap.set(comment.id, articles[i].id)
            })

            const bottomArea = generateBottomArea(comments[i], articles[i].user_id, likes[articles[i].id], likeStates[articles[i].id]);

            newArticleBlock.append(newBody, bottomArea);
            container.appendChild(newArticleBlock);
            allArticles.push([articles[i], newArticleBlock]);
        }
    }

    function getImageLayoutClass(length) {
        switch (length) {
            case 0:
                return '';
            case 1:
                return 'images-1Image';
            case 2:
            case 4:
                return 'images-2or4Images';
            default:
                return 'images-3or5orMore';
        }
    }

    function generateBody(article) {
        const newUsername = article.is_deleted ? article.default_username : article.username;
        const newAvatar = article.is_deleted ? article.default_avatar : article.avatar_path;

        const newBody = document.createElement('div');
        const titleWrapper = document.createElement('a');
        titleWrapper.classList.add('title-wrapper')
        const newTitle = document.createElement('h1');
        newTitle.classList.add('title')
        const topRow = generateTopRow(newUsername, newAvatar, article.updated_time)
        const newImageBlock = document.createElement('div');
        newImageBlock.classList.add('images')
        const newContent = document.createElement('div');
        newContent.classList.add('content')

        newTitle.textContent = article.title;
        titleWrapper.appendChild(newTitle)
        titleWrapper.href = `/articles/${article.id}`
        newContent.innerHTML = article.content;

        handleImages(article.image_path, newImageBlock)
        newBody.append(titleWrapper, topRow, newImageBlock, newContent);
        return newBody;
    }

    function handleImages(images, newImageBlock) {
        if (Array.isArray(images)) {
            images.forEach(imgPath => {
                const newImage = document.createElement('img');
                const newLink = document.createElement('a')
                const imagesClass = getImageLayoutClass(images.length);
                newImage.src = imgPath;

                newImage.classList.add('single-image');

                newLink.href = imgPath.replace('thumbnails', 'user-upload');
                newLink.target = 'blank';
                newLink.classList.add('image-container')

                newImageBlock.classList.add(imagesClass);

                newLink.appendChild(newImage)
                newImageBlock.appendChild(newLink);
            })
        }
    }

// generate the author row with author name, avatar and last edit time
    function generateTopRow(username, path, timeStr) {
        const topRow = document.createElement('div');
        topRow.classList.add('top-row');
        const left = document.createElement('div');
        left.classList.add('top-left')
        const authorName = document.createElement('div');
        authorName.classList.add('author-name')
        const authorAvatar = document.createElement('img');
        authorAvatar.classList.add('author-avatar')
        const lastEdit = document.createElement('div');
        lastEdit.classList.add('last-edit')

        const localTime = timeConvert(timeStr)

        authorName.textContent = username;
        authorAvatar.src = path;
        lastEdit.textContent = `Last edited ${localTime}`;

        left.append(authorAvatar, authorName);
        topRow.append(left, lastEdit);

        return topRow
    }

// generate comments area and like box
    function generateBottomArea(comments, authorId, likes, likeState) {
        const bottomArea = document.createElement('div');
        bottomArea.classList.add('bottom-area')
        const bottomFirstRow = document.createElement('div');
        bottomFirstRow.classList.add('bottom-first-row')

        const likeBox = document.createElement('div');
        likeBox.classList.add('like-box')
        const heart = document.createElement('div');
        heart.classList.add('heart');
        const likeNum = document.createElement('div');
        likeNum.classList.add('like-num');

        heart.textContent = '♥';
        if (likeState) {
            heart.classList.add('liked')
        }
        likeNum.textContent = likes

        likeBox.addEventListener('click', async function (e) {
            const isLoggedIn = await validateLogin();
            if (!isLoggedIn) {
                // alert('You may need to log in first.')
                window.location.href = '/account/login'
                return;
            }
            manipulateLike(this);
            heart.classList.toggle('liked')
        })

        const replyBox = document.createElement('button');
        replyBox.classList.add('reply-box')
        replyBox.dataset.level = '0';
        replyBox.textContent = 'Reply';
        replyBox.addEventListener('click', async function (e) {
            const isLoggedIn = await validateLogin();
            if (!isLoggedIn) {
                window.location.href = '/account/login'
                return
            }
            showRootReplyBlock(this);
        })

        const replyBlock = generateReplyBlock(true);

        const comment = generatedCommentsList(comments, authorId);

        likeBox.append(heart, likeNum)
        bottomFirstRow.append(likeBox, replyBox)
        bottomArea.append(bottomFirstRow, replyBlock, comment)

        return bottomArea
    }

    async function manipulateLike(likeBoxNode) {
        const articleNode = parentNodeGenerator(likeBoxNode, 3)
        const articleId = articleNode.dataset.articleId;
        const heartNode = likeBoxNode.querySelector('.heart')
        const isLiked = heartNode.classList.contains('liked');
        const likeNumNode = likeBoxNode.querySelector('.like-num')
        const likeCount = Number(likeNumNode.textContent);

        if (isLiked) {
            likeNumNode.textContent = likeCount - 1;
        } else {
            likeNumNode.textContent = likeCount + 1;
        }

        const dataPassed = {
            userId: userId,
            articleId: articleId,
            isLiked: isLiked
        }

        try {
            const promiseRes = await fetch('/api/likes/manipulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPassed)
            })
            const data = await promiseRes.json();
            if (!data.isLoggedIn) {

            }
        } catch (err) {
            alert("There's something wrong, please try like again.")
            console.log('Like box err: ', err);
            resetLikeBox(heartNode, likeNumNode, isLiked, likeCount);
        }
    }

    function resetLikeBox(heartNode, likeNumNode, isLiked, likeCount) {
        likeNumNode.textContent = likeCount;
        if (isLiked) {
            heartNode.classList.add('liked')
        } else {
            heartNode.classList.remove('liked')
        }
    }

    function showRootReplyBlock(replyBtn) {
        const textareaBlock = parentNodeGenerator(replyBtn, 2).querySelector('.textarea-block');
        textareaBlock.style.display = 'block';
        displayedTextareaNodes.push(textareaBlock);
    }

    function generatedCommentsList(comments, authorId) {
        const commentBlock = document.createElement('div');
        commentBlock.classList.add('comment')
        const commentBtn = document.createElement('div');
        commentBtn.classList.add('comment-btn')
        const commentsList = document.createElement('div');
        commentsList.classList.add('comments-list')

        commentBtn.addEventListener('click', showOrHideComments);
        commentBtn.dataset.isShown = 'true';

        const nodesArr = getNestedCommentsArr(comments, null, 1, authorId);
        nodesArr.forEach(node => {
            commentsList.append(node);
        })

        if (nodesArr.length === 0) {
            commentBtn.style.display = 'none';
        }

        commentBtn.textContent = 'Collapse'

        commentBlock.append(commentBtn, commentsList);

        return commentBlock
    }

    function getNestedCommentsArr(comments, parentId, level, authorId) {
        const nodesArr = [];

        const topComments = comments.filter(comment => comment.parent_id === parentId);
        topComments.forEach(comment => {
            // set top-level container of single comment
            const isAuthor = authorId === userId;
            const singleCommentContainer = assembleCommentUI(comment, level, isAuthor)

            nodesArr.push(singleCommentContainer);

            const childComments = getNestedCommentsArr(comments, comment.id, level + 1, authorId);
            childComments.forEach(child => {
                nodesArr.push(child);
            })
        });

        return nodesArr;
    }

    function generateCommentUI(comment) {
        const commentFirstLineWrapper = document.createElement('div');
        commentFirstLineWrapper.classList.add('comment-first-line')
        const commentUserWrapper = document.createElement('div');
        commentUserWrapper.classList.add('comment-user-wrapper')
        const commentAvatar = document.createElement('img');
        commentAvatar.classList.add('comment-avatar')
        const commentUser = document.createElement('span');
        commentUser.classList.add('comment-username')
        const commentTime = document.createElement('div');
        commentTime.classList.add('comment-time')
        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content')

        commentAvatar.src = comment.is_deleted ? comment.default_avatar : comment.avatar_path;
        commentUser.textContent = comment.is_deleted ? comment.default_username : comment.username;

        if (comment.created_time) {
            commentTime.textContent = timeConvert(comment.created_time).toLocaleString()
        } else {
            commentTime.textContent = 'Sending';
        }
        commentContent.textContent = comment.content;

        commentUserWrapper.append(commentAvatar, commentUser);
        commentFirstLineWrapper.append(commentUserWrapper, commentTime)

        return [commentFirstLineWrapper, commentContent]
    }

    function generateReplyBlock(isRoot) {
        const textareaBlock = document.createElement('div');
        textareaBlock.classList.add('textarea-block')
        textareaBlock.style.display = 'none';
        const textarea = document.createElement('textarea');
        textarea.classList.add('textarea-editor');
        const textareaBtn = document.createElement('button');
        textareaBtn.classList.add('textarea-button');
        textareaBtn.textContent = 'Submit';

        isRoot ? bindButtonWithRootReply(textareaBtn) : bindButtonWithComments(textareaBtn);

        textareaBlock.append(textarea, textareaBtn);
        return textareaBlock;
    }

    function bindButtonWithComments(button) {
        button.addEventListener('click', function (e) {
            addNewReplyNode(this, e);
        });
    }

    function bindButtonWithRootReply(button) {
        button.addEventListener('click', function (e) {
            addNewRootReplyNode(this, e);
        });
    }

    async function deleteComment(commentIdValue, userId) {
        const commentDeleted = document.querySelector(`[data-comment-id="${commentIdValue}"]`);
        if (!commentDeleted) {
            return
        }

        const commentList = commentDeleted.parentElement;
        const commentsAll = commentList.querySelectorAll('.single-comment');
        const commentsAllArr = Array.from(commentsAll)

        console.log(commentsAllArr)

        const commentDeletedIndex = commentsAllArr.indexOf(commentDeleted);
        const commentDeletedLevel = parseInt(commentDeleted.dataset.level);


        // delete selected one
        commentDeleted.remove();
        if (commentsAllArr.length === 1) {
            const parentNode = commentList.parentElement;
            parentNode.querySelector('.comment-btn').style.display = 'none';
        }

        // delete all the subclass comments
        for (let i = commentDeletedIndex + 1; i < commentsAll.length; i++) {
            const nextCommentNode = commentsAll[i];
            const nextCommentLevel = parseInt(nextCommentNode.dataset.level);

            if (nextCommentLevel > commentDeletedLevel) {
                nextCommentNode.remove();
            } else {
                break;
            }
        }

        // send fetch request here
        const formData = new FormData();

        formData.append('commentId', commentIdValue);
        formData.append('userId', userId);

        const result = (await fetch(`/api/comments/delete`, {
            method: 'POST',
            body: formData
        }))

        if (!result.ok) {
            alert('Deletion failed, please try again.');
        }
    }

    function showOrHideComments() {
        const commentBlock = this.parentElement;
        const allComments = commentBlock.querySelector('.comments-list');
        if (this.textContent.toLowerCase() === 'collapse') {
            this.textContent = 'Expand';
            this.dataset.isShown = 'false';
            allComments.style.display = 'none';
        } else if (this.textContent.toLowerCase() === 'expand') {
            this.textContent = 'Collapse'
            this.dataset.isShown = 'true';
            allComments.style.display = 'block';
        }
    }

    function addNewRootReplyNode(buttonNode) {
        const textareaBlockNode = buttonNode.parentElement
        const textarea = textareaBlockNode.querySelector('.textarea-editor');
        const commentBlock = textareaBlockNode.parentElement.querySelector('.comment');
        const commentList = commentBlock.querySelector('.comments-list')
        const articleNode = parentNodeGenerator(commentBlock, 2)

        const comment = {
            id: 0,
            user_id: userId,
            article_id: articleNode.dataset.articleId,
            username: username,
            avatar_path: avatar.src.split('3000')[1],
            parent_id: null,
            content: textarea.value.trim(),
            isAuthor: articleNode.dataset.isAuthor === 'true',
            mark: Date.now()
        }

        if (!comment.content) {
            alert('Reply cannot be null.')
            return;
        }

        const singleCommentContainer = generateSingleCommentContainer(comment, 1, comment.isAuthor);
        const replyNode = generateCommentUI(comment)
        singleCommentContainer.dataset.articleId = comment.article_id;
        singleCommentContainer.append(...replyNode);
        singleCommentContainer.classList.add('temp-comment');

        const mark = 'comment-' + comment.mark;
        singleCommentContainer.id = mark;

        commentList.append(singleCommentContainer);

        textarea.value = '';
        textareaBlockNode.style.display = 'none'
        displayedTextareaNodes.forEach((block, index) => {
            block.style.display = 'none';
        });
        displayedTextareaNodes.length = 0;

        // send to database
        sendReply(comment, mark, articleNode.dataset.articleId);
    }

    function addNewReplyNode(buttonNode, event) {
        const textareaBlockNode = buttonNode.parentElement
        const textarea = textareaBlockNode.children[0];
        const singleCommentNode = textareaBlockNode.parentElement;
        const commentListNode = singleCommentNode.parentElement;

        const allComments = commentListNode.querySelectorAll('.single-comment');
        const index = Array.from(allComments).indexOf(singleCommentNode);

        const comment = {
            id: 0,
            user_id: userId,
            article_id: singleCommentNode.dataset.articleId,
            username: username,
            avatar_path: avatar.src.split('3000')[1],
            parent_id: singleCommentNode.dataset.commentId,
            content: textarea.value.trim(),
            isAuthor: singleCommentNode.dataset.isAuthor,
            mark: Date.now()
        };


        if (!comment.content) {
            alert('Reply cannot be null.')
            return;
        }

        const replyNode = generateCommentUI(comment)
        const level = Number(singleCommentNode.dataset.level) + 1 + '';

        const singleCommentContainer = generateSingleCommentContainer(comment, level, comment.isAuthor, comment.article_id);
        singleCommentContainer.dataset.articleId = comment.article_id;
        singleCommentContainer.append(...replyNode);
        singleCommentContainer.classList.add('temp-comment');

        const mark = 'comment-' + comment.mark;
        singleCommentContainer.id = mark;

        let insertIndex = -1;

        for (let i = index + 1; i < allComments.length; i++) {
            if (allComments[i].dataset.level <= singleCommentNode.dataset.level) {
                insertIndex = i;
                break;
            }
        }

        insertIndex === -1 ? insertIndex = allComments.length : insertIndex;

        const insertPoint = allComments[insertIndex];
        commentListNode.insertBefore(singleCommentContainer, insertPoint);

        textarea.value = '';
        textareaBlockNode.style.display = 'none'
        displayedTextareaNodes.forEach((block, index) => {
            block.style.display = 'none';
        });
        displayedTextareaNodes.length = 0;

        event.stopPropagation()

        // send to database
        sendReply(comment, mark, singleCommentNode.dataset.articleId);
    }

    async function sendReply(comment, mark, articleId) {
        const promiseRes = await fetch('/api/comments/add',
            {
                method: 'POST',
                body: JSON.stringify(comment),
                headers: {'Content-Type': 'application/json'}
            });
        const data = await promiseRes.json();
        if (data.isLoggedIn) {
            const realComment = data.comment;
            commentArticleMap.set(realComment.id, articleId);
            console.log(commentArticleMap)
            reRenderNewReply(realComment, mark);
        } else {
            window.location.href = '/account/login'
        }
    }

    function reRenderNewReply(comment, mark) {
        comment.avatar_path = avatar.src.split('3000')[1];
        comment.username = username;
        const [commentFirstLineWrapper, commentContent] = generateCommentUI(comment);
        const textareaBlock = generateReplyBlock(false);
        const rootNode = document.querySelector(`#${mark}`);
        while (rootNode.firstChild) {
            rootNode.firstChild.remove();
        }
        rootNode.append(commentFirstLineWrapper, commentContent);
        generateCommentButtons(comment, rootNode);
        rootNode.appendChild(textareaBlock);
        textareaBlock.classList.add('margin-top-2em')

        rootNode.classList.remove('temp-comment');
        rootNode.dataset.commentId = comment.id;
    }

    function assembleCommentUI(comment, level, isAuthor) {
        const singleCommentContainer = generateSingleCommentContainer(comment, level, isAuthor)
        const commentContent = generateCommentUI(comment);
        const textareaBlock = generateReplyBlock(false);
        singleCommentContainer.append(...commentContent);
        generateCommentButtons(comment, singleCommentContainer);
        singleCommentContainer.appendChild(textareaBlock)
        textareaBlock.classList.add('margin-top-2em')
        return singleCommentContainer;
    }

    function generateSingleCommentContainer(comment, level, isAuthor) {
        const singleCommentContainer = document.createElement('div');
        singleCommentContainer.classList.add('single-comment');
        singleCommentContainer.classList.add(`level${level}`);

        singleCommentContainer.dataset.commentId = comment.id;
        // singleCommentContainer.dataset.userId = comment.user_id;
        singleCommentContainer.dataset.level = level;
        singleCommentContainer.dataset.isAuthor = isAuthor ? 'true' : 'false';

        const articleId = commentArticleMap.get(comment.id);
        singleCommentContainer.dataset.articleId = articleId || '0'

        bindShowingReplyBlockFunction(singleCommentContainer);
        return singleCommentContainer
    }

    function generateCommentButtons(comment, singleCommentContainer) {
        generateReplyButton(singleCommentContainer);
        generateDeleteButton(comment, singleCommentContainer);
    }

    function generateReplyButton(singleCommentContainer) {
        if (Number(singleCommentContainer.dataset.level) < 3) {
            const replyBtn = document.createElement('button');
            replyBtn.classList.add('comment-reply-btn');
            replyBtn.textContent = 'reply';
            bindShowingReplyBlockFunction(replyBtn);
            singleCommentContainer.appendChild(replyBtn);
        }
    }

    function generateDeleteButton(comment, singleCommentContainer) {
        if (comment.user_id === userId || singleCommentContainer.dataset.isAuthor === 'true') {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('comment-delete-btn');
            deleteBtn.textContent = 'delete';

            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!confirm('Confirm to delete?')) {
                    return;
                }
                const commentId = singleCommentContainer.dataset.commentId;
                deleteComment(commentId, comment.user_id);
            })
            singleCommentContainer.appendChild(deleteBtn);
        }
    }

    function bindShowingReplyBlockFunction(node) {
        node.addEventListener('click', async function (evt) {
            evt.stopPropagation();
            const isLoggedIn = await validateLogin();
            if (!isLoggedIn) {
                window.location.href = '/account/login'
                return
            }

            let singleCommentContainer = node;
            if (!node.classList.contains('single-comment')) {
                singleCommentContainer = node.parentElement;
            }

            displayedTextareaNodes.forEach((block, index) => {
                if (block !== singleCommentContainer.querySelector('.textarea-block')) {
                    block.style.display = 'none';
                    displayedTextareaNodes.splice(index, 1);
                }
            });

            const block = singleCommentContainer.querySelector('.textarea-block');
            if (singleCommentContainer.dataset.level > 2) {
                return;
            }

            displayedTextareaNodes.push(block);
            block.style.display = 'block';
            block.focus();
        });
    }

    document.addEventListener('click', function (e) {
        const isEditor = e.target.classList.contains('textarea-editor');

        if (!isEditor) {
            displayedTextareaNodes.forEach((block, index) => {
                block.style.display = 'none';
            });
            displayedTextareaNodes.length = 0;
        }
    });

    function timeConvert(timeStr) {
        const timeArr = timeStr.split(' ');
        const date = timeArr[0];
        const time = timeArr[1];
        const timeUTC = `${date}T${time}.000Z`;

        return new Date(timeUTC).toLocaleString();
    }

    function parentNodeGenerator(node, num) {
        let tempNode = node;
        for (let i = 0; i < num; i++) {
            tempNode = tempNode.parentElement;
        }
        return tempNode;
    }

    async function validateLogin() {
        const promiseRes = await fetch('/api/validate-login');
        const data = await promiseRes.json();
        return data.isLoggedIn;
    }

// ===============end================

// ==============start===============
// implement sort function
    const selectArr = document.querySelectorAll('select');
    for (const selectNode of selectArr) {
        selectNode.addEventListener('click', function (e) {
            // if (e.target.classList.contains('option')) {
            sortArticles(this, e);
            // }
        })
    }

    function sortArticles(selectNode, event) {
        const value = event.target.value.split('@');
        const category = value[0];
        const order = value[1];
        console.log(typeof category, category)
        console.log(typeof order, order)

        if (!order) {
            return
        }

        for (let i = 0; i < allArticles.length - 1; i++) {
            for (let j = 0; j < allArticles.length - i - 1; j++) {
                let tempArr;
                if (order.toUpperCase() === 'ASC') {
                    if (allArticles[j][0][category] > allArticles[j + 1][0][category]) {
                        tempArr = allArticles[j];
                        allArticles[j] = allArticles[j + 1];
                        allArticles[j + 1] = tempArr;
                    }
                } else {
                    if (allArticles[j][0][category] < allArticles[j + 1][0][category]) {
                        tempArr = allArticles[j];
                        allArticles[j] = allArticles[j + 1];
                        allArticles[j + 1] = tempArr;
                    }
                }
            }
        }

        container.innerHTML = '';
        for (const article of allArticles) {
            container.appendChild(article[1])
        }
        for (const node of selectArr) {
            if (node !== selectNode) {
                node.value = 'default';
            }
        }
    }

// ===============end================

    function generateFunction() {
        const articleNode = document.querySelector('.article')
        const isAuthor = articleNode.dataset.isAuthor;
        const articleId = Number(articleNode.dataset.articleId)

        const articleContainer = document.querySelector('#article-container');

        const functionArea = document.createElement('div');
        functionArea.classList.add('function');

        const backLink = document.createElement('a');
        backLink.classList.add('bottom-button');
        backLink.id = 'back-link';

        console.log(isSingleArticle)

        backLink.href = isSingleArticle.dataset.type === 'anonymous' ? '/' : `/profile/${isSingleArticle.dataset.type}${window.location.search}`;
        const backBtn = document.createElement('div');
        backBtn.id = 'back-btn';
        backBtn.textContent = 'Back';
        backLink.appendChild(backBtn);

        if (isAuthor === 'true') {
            const editLink = document.createElement('a');
            editLink.classList.add('bottom-button');
            editLink.id = 'edit-link';
            editLink.href = `/articles/my-articles/${articleId}/edit`
            const editBtn = document.createElement('div');
            editBtn.id = 'edit-btn';
            editBtn.textContent = 'Edit';
            editLink.appendChild(editBtn)

            const deleteLink = document.createElement('a');
            deleteLink.classList.add('bottom-button');
            deleteLink.id = 'delete-link';
            deleteLink.href = `/articles/my-articles/${articleId}/delete`;
            deleteLink.onclick = () => {
                confirm('Confirm to delete?')
            }
            const deleteBtn = document.createElement('div');
            deleteBtn.id = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteLink.appendChild(deleteBtn)

            functionArea.append(editLink, deleteLink)
        }
        functionArea.appendChild(backLink)
        articleContainer.appendChild(functionArea)
    }
})
