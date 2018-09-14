廖雪峰git教程：https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000

#  一安装
git软件下载地址： https://git-scm.com/download/win


#  二.配置你的用户名和密码
当你安装Git后首先要做的事情是设置你的用户名称和e-mail地址。这是非常重要的，因为每次Git提交都会使用该信息。它被永远的嵌入到了你的提交中：

git config --global user.name "xujun"
git config --global user.email "gdutxiaoxu@163.com"
　　重申一遍，你只需要做一次这个设置。如果你传递了 –global 选项，因为Git将总是会使用该信息来处理你在系统中所做的一切操作。如果你希望在一个特定的项目中使用不同的名称或e-mail地址，你可以在该项目中运行该命令而不要–global选项。

#  三.命令使用
从命令行创建一个新的仓库
touch README.md
git init   //初始化git仓库
git add README.md   可以指定添加文件到暂存区
git commit -m "first commit"
git remote add origin url
git push -u origin master
从命令行推送已经创建的仓库
git remote add origin url
git push -u origin master

git branch //查看master分支
git branch develop //创建develop分支
git checkout develop //切换到develop分支
git pull origin develop //从远程develop分支拉取最新版本到本地与本地分支合并

合并冲突解决： https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/001375840202368c74be33fbd884e71b570f2cc3c0d1dcf000

##  第一步
选择一个合适的地方，创建一个空目录，可以选择放桌面或D盘C盘，建议放非C盘   可以使用cd D: /  切换， 然后再D:
##  第二步
通过git init命令把这个目录变成Git可以管理的仓库
##  第三步
git status检查哪些未提交到本地仓库的暂存区
然后git add .
##  第四步
git commit -m '这里记录说明'  //-m后面输入的是本次提交的说明，可以输入任意内容，当然最好是有意义的，这样你就能从历史记录里方便地找到改动记录
git remote add origin  url   添加到远程仓库地址
git checkout 分支名(切换分支) 和git branch(查看当前分支，若在后面加上名称则为创建分支) 创建和切换分支
git push origin 分支名称如master


下载git上的项目
git clone url


修改远程仓库方法：
	git remote remove origin
	git remote add orgin  远程仓库地址




