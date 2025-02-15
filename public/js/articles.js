window.addEventListener("load", function () {
    // ==============begin===============
    // Set Quill
    const contentEditor = new Quill('#content-editor', {
        theme: 'snow',
        placeholder: 'Enter your content...',
        modules: {
            toolbar: [
                [{header: [2, 3, false]}],
                [{'font': []}],
                ['bold', 'italic', 'underline'],
                [{list: 'ordered'}, {list: 'bullet'}],
                [{'align': []}]
            ],
            clipboard: {
                matchVisual: false
            }
        }
    });
    // ===============end================

    // ==============begin===============
    // Preview images function
    const fileSelected = document.querySelector('#selected-image');
    const imageContainers = document.querySelectorAll('.image-container');
    const currentImages = document.querySelectorAll('.current-image');
    const submitBtn = document.querySelector('#submit');
    const title = document.querySelector('#title-editor');
    let newImagesFileArr = [];
    let originalImageArr = [];

    async function loadArticle() {
        const promiseRes = await fetch(`/articles/api/edit?articleId=${articleId}`)
        const data = await promiseRes.json();

        console.log(data)

        if (data.isValid.toUpperCase() === 'NA') {
            alert('Only the author can edit this article.')
            window.location.href = 'http://127.0.0.1:3000/profile/my-articles'
            return
        } else if (data.isValid.toUpperCase() === 'NE') {
            alert("Article doesn't exist.")
            window.location.href = 'http://127.0.0.1:3000/profile/my-articles'
            return
        }

        title.value = data.title;
        contentEditor.root.innerHTML = data.content;
        const imagesPath = data.images

        if (imagesPath.length > 0) {
            for (let i = 0; i < imagesPath.length; i++) {
                const pathArr = imagesPath[i].split('-')
                const file = {
                    name: pathArr[pathArr.length - 1],
                    path: imagesPath[i]
                }

                const [newImg, deleteBtn] = generateSubNodes(file);
                bindDeleteBtnFunction(deleteBtn, imageContainers[i]);
                imageContainers[i].append(newImg, deleteBtn)

                const imageObj = {
                    container: imageContainers[i],
                    file: file,
                    index: i,
                    type: 'original'
                }

                newImagesFileArr.push(imageObj);
                originalImageArr.push(imageObj);
            }
        }
        initFileSelector();
    }

    function initFileSelector() {
        fileSelected.addEventListener('change', (e) => {
            if (imageContainers[imageContainers.length - 1].querySelector('.single-image')) {
                alert('The number of image is up to 9.')
                return
            }

            const file = fileSelected.files[0];

            if (file) {
                const maxSize = 1.5 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('Image size cannot exceed 1.5MB.');
                    fileSelected.value = '';
                    return
                }

                const allowedFileTypes = [".bmp", ".jpg", ".jpeg", ".png", ".gif"];
                const fileName = file.name

                const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
                if (!allowedFileTypes.includes(extension)) {
                    alert('Please select a valid image file (bmp, jpg/jpeg, pne, gif).')
                    return;
                }
                showImage(file);
            }
        })
    }

    function showImage(file) {
        const [newImg, deleteBtn] = generateSubNodes(file);

        let firstEmptyContainer;
        for (let i = 0; i < imageContainers.length - 1; i++) {
            if (!imageContainers[i].querySelector('.single-image')) {
                firstEmptyContainer = imageContainers[i]
                break;
            }
        }

        firstEmptyContainer.innerHTML = '';
        firstEmptyContainer.append(newImg, deleteBtn);

        const containersArr = Array.from(imageContainers);
        const emptyContainerIndex = containersArr.indexOf(firstEmptyContainer);
        newImagesFileArr.push({
            container: firstEmptyContainer,
            file: file,
            index: emptyContainerIndex,
            type: 'new'
        })
        bindDeleteBtnFunction(deleteBtn, firstEmptyContainer);
        fileSelected.value = '';
    }

    function generateSubNodes(file) {
        const newImg = document.createElement('img');
        newImg.src = file.path || URL.createObjectURL(file);
        newImg.alt = file.name;
        newImg.classList.add('single-image')
        newImg.dataset.type = 'new'

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.textContent = 'Delete'

        return [newImg, deleteBtn]
    }

    // ===============end================

    function reloadImages(index) {
        for (let i = index; i < imageContainers.length; i++) {
            const container = imageContainers[i];
            container.innerHTML = '';

            if (i < newImagesFileArr.length) {
                const tempObj = newImagesFileArr[i];
                const [newImg, deleteBtn] = generateSubNodes(tempObj.file);

                tempObj.container = container;
                tempObj.index = i;
                bindDeleteBtnFunction(deleteBtn, container);
                container.append(newImg, deleteBtn);
            }
        }
    }

    // ==============begin===============
    // submit new post function
    async function submitNewPost() {
        const formData = generateFormData(newImagesFileArr);
        if (!formData) {
            return;
        }

        try {
            const response = await fetch('/articles/api/submit', {
                method: 'post',
                body: formData
            })

            if (response.redirected) {
                window.location.href = response.url;
            }
        } catch (err) {
            alert('Failed to submit, ' + err.message)
        }
    }

    // ===============end================

    // ==============begin===============
    async function updateArticle() {
        const deletedObjArr = originalImageArr.filter(item => !newImagesFileArr.includes(item));
        const deletedImagePath = [];
        const keptImagePath = [];
        const newImages = [];

        deletedObjArr.forEach(objItem =>{
            deletedImagePath.push(objItem.file.path);
        })

        newImagesFileArr.forEach(objItem => {
            if(objItem.type.toLowerCase() === 'new'){
                newImages.push(objItem);
            }else {
                keptImagePath.push(objItem.file.path)
            }
        })

        const formData = generateFormData(newImages);
        if (!formData) {
            return;
        }

        formData.append('keptImages', JSON.stringify(keptImagePath));
        formData.append('deletedImages', JSON.stringify(deletedImagePath));
        formData.append('articleId', articleId);

        try {
            const promiseRes = await fetch('/articles/api/update', {
                method: 'post',
                body: formData
            })
            const data = await promiseRes.json();
            if(data.result === 'false'){
                window.location.href = '/articles/my-articles'
            }else if(data.result === 'fail'){
                window.location.href = '/articles/my-articles'
            }else {
                window.location.href = `/articles/my-articles/${articleId}`
            }

        } catch (err) {
            alert('Failed to submit, ' + err.message)
        }
    }

    // ===============end================

    function generateFormData(imagesArr) {
        const formData = new FormData()
        const titleValue = title.value;

        if (!titleValue) {
            alert('Title cannot be empty.')
            return null;
        }

        const contentValue = contentEditor.root.innerHTML;

        imagesArr.forEach(imageFile => {
            formData.append('images[]', imageFile.file)
        })

        formData.append('title', titleValue);
        formData.append('content', contentValue);

        return formData;
    }

    // ==============begin===============
    function bindDeleteBtnFunction(button, container) {
        button.addEventListener('click', (e) => {
            for (let i = 0; i < newImagesFileArr.length; i++) {
                if (newImagesFileArr[i].container === container) {
                    newImagesFileArr.splice(i, 1);
                    container.innerHTML = '';
                    reloadImages(i);
                    break;
                }
            }
        })
    }

    // ===============end================

    // ==============begin===============
    // init page
    const pagePath = window.location.pathname;
    const pagePathArr = pagePath.split('/')
    const articleId = pagePathArr[pagePathArr.length - 2]

    if (pagePath.includes('post')) {
        initFileSelector();
        submitBtn.addEventListener('click', async function (e) {
            await submitNewPost();
        })
    } else {
        loadArticle();
        submitBtn.addEventListener('click', async function (e) {
            await updateArticle();
        })
    }
    // ===============end================
})
