<template>
    <div>
     	<head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="14" :offset="4">
	  			<header class="form_header">添加事项</header>
	  			<el-form :model="formData" ref="formData" label-width="110px" class="form food_form">
	  				<el-form-item label="事项" prop="content">
						<el-input v-model="formData.content"></el-input>
					</el-form-item>
                    <el-form-item>
						<el-button type="primary" @click="addTodo()" v-loading.fullscreen.lock="fullscreenLoading">添加事项</el-button>
					</el-form-item>

                     <el-form-item label="上传店铺头像">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/api/upload'"
                            :show-file-list="true"
                            list-type="picture"
                            :on-success="handleShopAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="formData.image_path" :src="baseImgPath + formData.image_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
	  			</el-form>

               
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
 	import headTop from '@/components/headTop'
    import {addTodo} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
    export default {
    	data(){
    		return {
    			formData: {
                    content:'',
                    image_path:''
                },
                baseUrl,
				baseImgPath,
				fullscreenLoading:false,
    		}
    	},
    	components: {
    		headTop,
    	},
    	created(){
    	},
    	computed: {
    		// selectValue: function (){
    		// 	return this.categoryForm.categoryList[this.categoryForm.categorySelect]||{}
    		// }
    	},
    	methods: {
		    async addTodo(){
			    try{
					this.fullscreenLoading = true;
					const result = await addTodo(this.formData);
					this.fullscreenLoading = false
					if (result.status == 'success') {
						console.log(result)
						this.$message({
                            type: 'success',
                            message: '添加成功'
					    });
					    this.formData.content ='';
					}else{
						this.$message({
					        type: 'error',
					        message: result.message
					    });
					}
				}catch(err){
					console.log(err)
				}				
            },
            handleShopAvatarScucess(res, file) {
				if (res.status == 'success') {
                    this.formData.image_path = res.image_path;
                    this.$message({
                            type: 'success',
                            message: '上传成功'
					    });
				}else{
					this.$message.error('上传图片失败！');
				}
            },
            beforeAvatarUpload(file) {
				const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isRightType) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isRightType && isLt2M;
			},
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.form{
		min-width: 400px;
		margin-bottom: 30px;
		&:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
	}
	.food_form{
		border: 1px solid #eaeefb;
		padding: 10px 10px 0;
	}
	.form_header{
		text-align: center;
		margin-bottom: 10px;
	}
	.category_select{
		border: 1px solid #eaeefb;
		padding: 10px 30px 10px 10px;
		border-top-right-radius: 6px;
		border-top-left-radius: 6px;
	}
	.add_category_row{
		height: 0;
		overflow: hidden;
		transition: all 400ms;
		background: #f9fafc;
	}
	.showEdit{
		height: 185px;
	}
	.add_category{
		background: #f9fafc;
		padding: 10px 30px 0px 10px;
		border: 1px solid #eaeefb;
		border-top: none;
	}
	.add_category_button{
		text-align: center;
		line-height: 40px;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border: 1px solid #eaeefb;
		border-top: none;
		transition: all 400ms;
		&:hover{
			background: #f9fafc;
			span, .edit_icon{
				color: #20a0ff;
			}
		}
		span{
			.sc(14px, #999);
			transition: all 400ms;
		}
		.edit_icon{
			color: #ccc;
			transition: all 400ms;
		}
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
	.cell{
		text-align: center;
	}
</style>
