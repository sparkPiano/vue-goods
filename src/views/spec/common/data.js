export const columns = [
    {
        title: '序号',
        type: 'index',
        width: 70,
        align: 'center'
    },
    {
        key: 'sname',
        align: 'center',
        title: '规格名称',
        ellipsis: true
    },
    {
        key: 'remark',
        align: 'center',
        title: '说明',
        width: 120
    },
    {
        key: 'cat_name',
        align: 'center',
        width: 150,
        ellipsis: true,
        title: '所属类目'
    },
    {
        title: '操作',
        align: 'center',
        width: 220,
        key: 'handle',
        handle: ['setIntv', 'editD', 'delete']
    }
];

const tableData = {
    columns: columns
};
export default tableData;