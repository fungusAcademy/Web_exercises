function genPage()
{
    //1 lvl
    var ul = $("<ul>");
    $("body").append(ul);
    var li1 = $("<li>").text("Животные");
    var li2 = $("<li>").text("Рыбы");
    $(ul).append(li1, li2);
    
    //2 lvl
    ul = $("<ul>");
    $(li1).append(ul);
    var ul2li1 = $("<li>").text("Млекопитающие");
    var ul2li2 = $("<li>").text("Другие");
    $(ul).append(ul2li1, ul2li2);
    
    ul = $("<ul>");
    $(li2).append(ul);
    var ul2li3 = $("<li>").text("Аквариумные");
    var ul2li4 = $("<li>").text("Морские");
    $(ul).append(ul2li3, ul2li4);
    
    //3 lvl
    ul = $("<ul>");
    $(ul2li1).append(ul);
    $(ul).append($("<li>").text("Коровы"));
    $(ul).append($("<li>").text("Ослы"));
    $(ul).append($("<li>").text("Собаки"));
    $(ul).append($("<li>").text("Тигры"));
    
    ul = $("<ul>");
    $(ul2li2).append(ul);
    $(ul).append($("<li>").text("Змеи"));
    $(ul).append($("<li>").text("Птицы"));
    $(ul).append($("<li>").text("Ящерицы"));
    
    ul = $("<ul>");
    $(ul2li3).append(ul);
    $(ul).append($("<li>").text("Гуппи"));
    $(ul).append($("<li>").text("Скалярии"));
    
    ul = $("<ul>");
    $(ul2li4).append(ul);
    $(ul).append($("<li>").text("Морская форель"));
    
//    $("body").find("ul:first").attr("onClick", "makeMagic()");
}

function showInfo()
{
    $("div").remove();
    
    var info = $("<div>");

    $("li").each(function()
    {
            $(info).append($(this).contents().filter(function(){return this.nodeType == 3}).text() + " ");
            $(info).append($(this).contents().filter(function(){return this.nodeType == 1}).find("li").length + " | ");
    });

        $("body").append(info);
}