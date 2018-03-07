@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                     <div class="col-md-13">
                            <!-- BEGIN BORDERED TABLE PORTLET-->
                            <div class="portlet light portlet-fit bordered">
                                <div class="portlet-title">
                                    <div class="caption">
                                        <i class="icon-settings font-red"></i>
                                        <span class="caption-subject font-red sbold uppercase">User Table</span>
                                    </div> 
                                </div>
                                <div class="portlet-body">
                                    <div class="table-scrollable table-scrollable-borderless">
                                        <table class="table table-hover table-light">
                                            <thead>
                                                <tr class="uppercase">
                                                    <th> No </th>
                                                    <th> First Name </th>
                                                    <th> Last Name </th>
                                                    <th> Username </th>
                                                    <th> Status </th>
                                                    <th> Action </th>
                                                </tr>
                                            </thead>
                                            <tbody> 
                                                <?php 
                                                    $no = 1;
                                                 ?>
                                                @foreach($users as $user) 
                                                    <tr>
                                                        <td> {{$no}} </td>
                                                        <td> {{$user->username}} </td>
                                                        <td> {{$user->display_name}} </td>
                                                        <td> {{$user->email}} </td>
                                                        <td>
                                                            <span class="label label-sm label-danger"> Blocked </span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript:;" class="btn btn-outline btn-circle btn-sm purple">
                                                            <i class="fa fa-edit"></i> Edit </a> 

                                                            <a href="javascript:;" class="btn btn-outline btn-circle dark btn-sm black">
                                                            <i class="fa fa-trash-o"></i> Delete </a></td>
                                                    </tr> 
                                                     <?php $no++; ?>
                                                @endforeach 


                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <!-- END BORDERED TABLE PORTLET-->
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
