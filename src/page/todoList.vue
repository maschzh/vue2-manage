<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="事项">
                        <span>{{ props.row.content }}</span>
                      </el-form-item>
                      <el-form-item label="创建时间">
                        <span>{{ props.row.created_at }}</span>
                      </el-form-item>
                      <el-form-item label="是否完成">
                        <!-- <el-checkbox v-model="props.row.is_finished"></el-checkbox> -->
                        <span>{{ props.row.isFinished }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="事项"
                  prop="content">
                </el-table-column>
                <el-table-column
                  label="创建时间"
                  prop="created_at">
                </el-table-column>
                <el-table-column
                  label="是否完成"
                  prop="isFinished">
                </el-table-column>
                <el-table-column label="操作" width="240">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      @click="handleTodo(scope.$index, scope.row)">完成</el-button>
                    <el-button
                      size="mini"
                      type="Success"
                      @click="addTodo(scope.$index, scope.row)">添加事项</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>
            <el-dialog title="修改事项信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="事项" label-width="100px">
                        <el-input v-model="selectTable.content" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否完成" label-width="100px">
                        <el-input v-model="selectTable.isFinished"></el-input>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateTodo">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {cityGuess, getResturants, getResturantsCount, foodCategory, updateResturant, searchplace, deleteResturant, getTodoListCount, getAllTodo, deleteTodo, updateTodo} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                city: {},
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                content:{},
            }
        },
        created(){
            this.initData();
            console.log(11111)
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    const countData = await getTodoListCount();
                    if (countData.status == 'success') {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getTodoList();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getTodoList(){
                const rtnData = await getAllTodo();
                this.tableData =[];
                rtnData.todos.forEach(item=>{
                    const data = {};
                    data._id = item._id;
                    data.content = item.content;
                    data.created_at = item.created_at;
                    if(!item.is_finished){
                        data.isFinished = '未完成'
                    } else {
                        data.isFinished = '完成'
                    }
                    
                    this.tableData.push(data);
                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getAllTodo()
            },
            handleEdit(index, row) {
                this.selectTable = row;
                if(this.selectTable.isFinished=='完成'){
                    this.selectTable.is_finished = true;
                } else {
                    this.selectTable.is_finished = false;
                }
                this.dialogFormVisible = true;
            },
            addTodo(index, row){
                this.$router.push({ path: 'addTodos'})
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteTodo(row._id);
                    if (res.status == 'success') {
                        this.$message({
                            type: 'success',
                            message: '删除事项成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除事项失败')
                }
            },
            async updateTodo(){
                this.dialogFormVisible = false;
                try{
                    const res = await updateTodo(this.selectTable)
                    if(res.status == 'success'){
                        this.$message({
                            type: 'success',
                            message: '更新事项信息成功'
                        });
                        this.getAllTodo();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新事项信息失败', err);
                }
            },
            async handleTodo(index, row){
                let todo = row;
                todo.is_finished = true;
                todo.finished_at = new Date();
                todo.isFinished = '完成';
                row.isFinished = '完成';
                try{
                    const res = await updateTodo(todo)
                    if(res.status == 'success'){
                        this.$message({
                            type: 'success',
                            message: '更新店事项息成功'
                        });
                        this.getAllTodo();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新事项信息失败', err);
                } 
            }
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
