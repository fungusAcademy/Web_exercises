function genPage()
{
    clear("ul1");

    var ulist;
    var li;

    // 1 level - appendChild
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul1');
    li = document.createElement('li');
    li.setAttribute('id', 'ul1li1');
    li.innerHTML = "Животные";
    ulist.appendChild(li);
    li = document.createElement('li');
    li.setAttribute('id', 'ul1li2');
    li.innerHTML = "Рыбы";
    ulist.appendChild(li);
    document.body.appendChild(ulist);
       
    // 2 level append child + insert before
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul21');
    li = document.createElement('li');
    li.setAttribute('id', 'ul21li1');
    li.innerHTML = "Другие";
    ulist.appendChild(li);
    li = document.createElement('li');
    li.setAttribute('id', 'ul21li2');
    li.innerHTML = "Млекопитающие";
    document.getElementById("ul1li1").appendChild(ulist);
    ulist.insertBefore(li, document.getElementById('ul21li1'));
        
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul22');
    li = document.createElement('li');
    li.setAttribute('id', 'ul22li1');
    li.innerHTML = "Морские";
    ulist.appendChild(li);
    li = document.createElement('li');
    li.setAttribute('id', 'ul22li2');
    li.innerHTML = "Аквариумные";
    document.getElementById('ul1li2').appendChild(ulist);
    ulist.insertBefore(li, document.getElementById('ul22li1'));

    // 3 level insert before
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul31');
    document.getElementById('ul21li2').appendChild(ulist);
    li = document.createElement('li');
    li.setAttribute('id', 'ul31li1');
    li.innerHTML = "Тигры";
    ulist.appendChild(li);
    li = document.createElement('li');
    li.setAttribute('id', 'ul31li2');
    li.innerHTML = "Собаки";
    ulist.insertBefore(li, document.getElementById('ul31li1'));
    li = document.createElement('li');
    li.setAttribute('id', 'ul31li3');
    li.innerHTML = "Ослы";
    ulist.insertBefore(li, document.getElementById('ul31li2'));
    li = document.createElement('li');
    li.setAttribute('id', 'ul31li4');
    li.innerHTML = "Коровы";
    ulist.insertBefore(li, document.getElementById('ul31li3'));
        
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul32');
    document.getElementById('ul21li1').appendChild(ulist);
    li = document.createElement('li');
    li.setAttribute('id', 'ul32li1');
    li.innerHTML = "Ящерицы";
    ulist.appendChild(li);
    li = document.createElement('li');
    li.setAttribute('id', 'ul32li2');
    li.innerHTML = "Птицы";
    ulist.insertBefore(li, document.getElementById('ul32li1'));
    li = document.createElement('li');
    li.setAttribute('id', 'ul33li3');
    li.innerHTML = "Змеи";
    ulist.insertBefore(li, document.getElementById('ul32li2'));
        
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul33');
    document.getElementById('ul22li2').appendChild(ulist);
    li = document.createElement('li');
    li.setAttribute('id', 'ul33li1');
    li.innerHTML = "Скалярии";
    ulist.appendChild(li);
    li = document.createElement('li');
    li.setAttribute('id', 'ul33li2');
    li.innerHTML = "Гуппи";
    ulist.insertBefore(li, document.getElementById('ul33li1'));
        
    ulist = document.createElement('ul');
    ulist.setAttribute('id', 'ul34');
    document.getElementById('ul22li1').appendChild(ulist);
    li = document.createElement('li');
    li.setAttribute('id', 'ul34li1');
    li.innerHTML = "Морская форель";
    ulist.appendChild(li);
}

function getNodeInfo(node)
{
    var info = document.createElement("div");
    var text = document.createTextNode("");
    
    if (node.nodeType == 1)
    {
        text.textContent +=  " | " + node.tagName + " ";
        
        if (node.getAttribute('id') != null)
        {
            text.textContent += node.getAttribute('id') + " ";
        }
    }
    else if (node.nodeType == 3)
    {
        if (node.nodeValue.trim().length != 0)
        {
            text.textContent += node.textContent + " | - ";
        }
    }

    info.appendChild(text);

    if (node.hasChildNodes)
    {
        var childList = node.childNodes;
        
        for (var i = 0; i < childList.length; i++)
        {
            text.textContent += getNodeInfo(childList[i]).textContent;
        }
    }
    
    return info;
}

function getInfo()
{
    clear("infoNode");
    
    var root = document.documentElement;
    var infoNode = document.createElement("div");
    
    infoNode = getNodeInfo(root);
    infoNode.setAttribute("id", "infoNode");

    document.body.appendChild(infoNode);
}

function clear(id)
{
    if (document.getElementById(id) != null)
    {
        document.removeChild(document.getElementById(id));
    }
}