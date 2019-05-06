<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="接口地址" prop="address">
						<el-input v-model="formData.address"></el-input>
					</el-form-item>
					<el-form-item label="接口类型">
						<el-select v-model="formData.type" placeholder="请选择">
						    <el-option
						      	v-for="item in types"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.value">
						    </el-option>
					 	</el-select>
					</el-form-item>
					<el-form-item label="接口参数" prop="parameter">
						<el-input v-model="formData.parameter"></el-input>
					</el-form-item>
					<el-form-item label="返回结果">
						<span>{{result}}</span>
					</el-form-item>
					<el-form-item class="button_submit">
						<el-button type="primary" @click="submitForm('formData')">立即测试</el-button>
					</el-form-item>
				</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {cityGuess, addShop, searchplace, foodCategory, getMOInfo} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
    export default {
    	data(){
    		return {
    			formData: {
					address: '', //地址
					parameter:'',
					type:'',
		        },
				types:[{
						value: 'GET',
		        label: 'GET'
					},{
						value: 'POST',
		        label: 'POST'
					},{
						value: 'PUT',
		        label: 'PUT'
					},{
						value: 'DELETE',
		        label: 'DELETE'
				}],
				result:[],	
			  	baseUrl,
				baseImgPath, 
			}
    	},
    	components: {
    		headTop,
    	},
    	mounted(){
    		this.initData();
    	},
    	methods: {
            initData(){
                this.formData.address = window.localStorage.getItem("encrypt_address");
                this.formData.type = window.localStorage.getItem("encrypt_type");
            },
			async submitForm(){
                window.localStorage.setItem("encrypt_address", this.formData.address);
                window.localStorage.setItem("encrypt_type", this.formData.type);
				try{
					let result = await getMOInfo(this.formData.address, null,this.formData.type);
					this.result = result;		
				}catch(err){
					console.log(err);
				}
			},
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.button_submit{
		text-align: center;
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
	.el-table .info-row {
	    background: #c9e5f5;
	}

	.el-table .positive-row {
	    background: #e2f0e4;
	}
</style>

