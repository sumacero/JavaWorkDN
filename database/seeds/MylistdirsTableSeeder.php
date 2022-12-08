<?php

use Illuminate\Database\Seeder;

class MylistdirsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $param = [
            'user_id' => '1',
            'mylistdir_name' => 'マイリスト1',
            // 0:false, 1:true
            'is_open' => '1'
        ];
        DB::table('mylistdirs')->insert($param);
    }
}
