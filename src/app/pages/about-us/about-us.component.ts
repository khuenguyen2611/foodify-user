import { Component, OnInit } from '@angular/core';
import { TeamSlider, TestimonialSlider } from '../../shared/data/slider';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }
    public content = "Foodify là một trong những dự án mà team Pyramide đã chọn khi bắt đầu quá trình chọn lọc đề tài cho đồ án tốt nghiệp của tụi mình. Trải qua nhiều quá trình, chúng mình đã đưa ra sản phẩm đúng tiến trình đề ra. Các thành viên đã luôn cố gắng không ngừng nghỉ để hoàn thành tốt các phần việc của mình." +
        " Từ việc bắt đầu chọn công nghệ, nghiên cứu cơ sở dữ liệu và bắt tay vào code, test và hoàn thiện sản phẩm, chúng mình luôn mong muốn chọn được những điều tốt nhất cho mọi người."
    public content2 = "Foodify sử dụng công nghệ Angular và Spring Boot cho các website, Java cho mobile và mySQL để quản lý dữ liệu. Bên cạnh đó, chúng mình còn sử dụng một số công nghệ như Firebase phục vụ cho việc quản lý người dùng và đăng nhập." +
        " Chúng mình sử dụng Vercel để deploy front-end, Railway cho back-end và dùng Android Studio để tạo ra các file apk mang đến cho người dùng Android trải nghiệm một ứng dụng đặt đồ ăn trực tuyến được thực hiện bởi sinh viên trường Đại học FPT Đà Nẵng";

    public TeamSliderConfig: any = TeamSlider;
    public TestimonialSliderConfig: any = TestimonialSlider;

    // Testimonial Carousel
    public testimonial = [{
        image: 'assets/images/testimonial/quoc_duong.png',
        name: 'Dương Nguyễn Đức Quốc',
        designation: 'Mentor',
        description: 'Là một trong 2 mentor của đồ án, hỗ trợ công việc cho team, giúp team chọn ra những công nghệ và hướng đi phù hợp với dự án. Bên cạnh đó, anh luôn bám sát dự án, giúp dự án hoàn thành như dự kiến.',
    }, {
        image: 'assets/images/testimonial/thach.png',
        name: 'Lê Quang Thạch',
        designation: 'Mentor',
        description: 'Mentor hỗ trợ kỹ thuật cho team, giúp team giải quyết các vấn đề gặp phải và đưa ra các giải pháp phù hợp. Ngoài ra, anh còn là người đôn đốc team hoàn thành dự án đúng hạn.',
    }]

    // Team
    public team = [{
        image: 'assets/images/team/khue.png',
        name: 'Nguyễn Hà Khuê',
        designation: 'Team Leader'
    }, {
        image: 'assets/images/team/quang.png',
        name: 'Võ Đình Minh Quang',
        designation: 'Team Sub-leader'
    }, {
        image: 'assets/images/team/loi.png',
        name: 'Phan Hữu Lợi',
        designation: 'Team member'
    }, {
        image: 'assets/images/team/dat.png',
        name: 'Nguyễn Đức Đạt',
        designation: 'Team member'
    }, {
        image: 'assets/images/team/hoang.png',
        name: 'Trần Ngọc Hoàng',
        designation: 'Team member'
    }]

}
