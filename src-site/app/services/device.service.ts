import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs/observable';

@Injectable()
export class DeviceService {
  constructor(private breakPointObserver: BreakpointObserver) {}

  public checkXlScreen(): Observable<BreakpointState> {
    return this.breakPointObserver.observe([Breakpoints.XLarge]);
  }

  public checkLgScreen(): Observable<BreakpointState> {
    return this.breakPointObserver.observe([Breakpoints.Large]);
  }

  public checkMdScreen(): Observable<BreakpointState> {
    return this.breakPointObserver.observe([Breakpoints.Medium]);
  }

  public checkSmScreen(): Observable<BreakpointState> {
    return this.breakPointObserver.observe([Breakpoints.Small]);
  }

  public checkXsScreen(): Observable<BreakpointState> {
    return this.breakPointObserver.observe([Breakpoints.XSmall]);
  }
}
