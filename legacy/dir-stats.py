#!/usr/bin/env python3

import json
import os
import sys

"""
Compute directory statistics recursively.
Usage: dir-stats.py path/to/dir
"""


class DirStats:
    """
    Directory statistics
    """
    def __init__(self, path, name):
        self.path = path
        self.name = name
        self.count = 0
        self.size = 0
        self.depth = 0
        self.children: list = []

    def __str__(self) -> str:
        return self.name + " {size: " + str(self.size) \
               + ", count: " + str(self.count) + "}"

    def to_dict(self) -> dict:
        return {"path": self.path, "name": self.name,
                "count": self.count, "size": self.size, "depth": self.depth,
                "children": [e.to_dict() for e in self.children]}


def compute_stats(path: str) -> DirStats:
    """
    Calculate statistics recursively
    :param path: Path to directory
    :return: Directory statistics
    """
    d = DirStats(path, os.path.basename(path))
    try:
        with os.scandir(path) as it:
            for entry in it:
                # Count entries in directory
                d.count += 1
                if entry.is_dir():
                    # Recursive call for directories
                    child_stats = compute_stats(entry.path)
                    d.children.append(child_stats)
                    d.size += child_stats.size
                    d.count += child_stats.count
                elif entry.is_file():
                    # Append file size
                    d.size += entry.stat().st_size
    except:
        pass # ignored
    # Calculate directory depth
    if d.children:
        d.depth = 1 + max(map(lambda e: e.depth, d.children))
    return d


if __name__ == '__main__':
    # Get path to directory
    if len(sys.argv) != 2:
        print("Error: accepts 1 argument, received 0")
        print("Usage: dir-stats.py <path>")
        exit(1)

    dir_path = sys.argv[1].strip("/")
    if not os.path.isdir(dir_path) or not os.path.exists(dir_path):
        print("Path", dir_path, "must be a valid directory")
        exit(2)

    # Compute directory statistics
    stats = compute_stats(dir_path)
    print(json.dumps(stats.to_dict()))
