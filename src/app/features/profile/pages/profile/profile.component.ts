import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError, switchMap } from "rxjs/operators";
import { combineLatest, of, throwError } from "rxjs";
import { UserService } from "../../../../core/auth/services/user.service";
import { Profile } from "../../models/profile.model";
import { ProfileService } from "../../services/profile.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FollowButtonComponent } from "../../components/follow-button.component";
import { mockUser } from "src/app/core/auth/mockUser";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile.component.html",
  imports: [
    FollowButtonComponent,
    NgIf,
    RouterLink,
    AsyncPipe,
    RouterLinkActive,
    RouterOutlet,
    FollowButtonComponent,
  ],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  profile!: Profile;
  isUser: boolean = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.params["username"];

    if (username === "smth") {
      this.profile = mockUser;
      this.isUser = false;
    } else {
      this.profileService
        .get(username)
        .pipe(
          switchMap((profile) => {
            return combineLatest([of(profile), this.userService.currentUser]);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(([profile, user]) => {
          this.profile = profile;
          this.isUser = profile.username === user?.username;
        });
    }
  }

  onToggleFollowing(profile: Profile) {
    this.profile = profile;
  }
}
