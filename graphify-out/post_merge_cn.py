"""
Targeted merge for cn() — 3 nodes from same file with different labels.
Also handles same-file nodes where one label is clearly a variant of another.
"""
import json
from pathlib import Path
from collections import defaultdict
from networkx.readwrite import json_graph
import networkx as nx
import re


def normalize_path(p):
    p = p.replace('\\', '/')
    p = re.sub(r'^src/', '', p)
    return p.lower()


def merge_nodes(G, keep, drop):
    for neighbor in list(G.neighbors(drop)):
        if neighbor == keep:
            continue
        edge_data = G.get_edge_data(drop, neighbor) or {}
        if not G.has_edge(keep, neighbor):
            G.add_edge(keep, neighbor, **edge_data)
    G.remove_node(drop)


def main():
    graph_path = Path('graphify-out/graph.json')
    data = json.loads(graph_path.read_text(encoding='utf-8'))
    G = json_graph.node_link_graph(data, edges='links')
    print(f"Before: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")

    # Group all nodes by normalized source file
    by_file = defaultdict(list)
    for n in G.nodes():
        nd = G.nodes[n]
        src = normalize_path(nd.get('source_file', ''))
        by_file[src].append(n)

    merged = 0
    # For each file with multiple nodes, check if any have same base name
    # Strategy: extract the "core" from label (strip suffixes like "()", "Component", "Hook", "utility", "Class Merge Utility")
    suffix_strip = re.compile(r'\s*(utility.*|component|hook|class merge utility|function|interface|type|schema|constant|static data|\(\))\s*$', re.I)

    for src_file, nodes in by_file.items():
        if len(nodes) < 2:
            continue
        # Build core-label groups
        core_groups = defaultdict(list)
        for n in nodes:
            if not G.has_node(n):
                continue
            label = G.nodes[n].get('label', n).strip()
            core = suffix_strip.sub('', label).strip().lower()
            core_groups[core].append(n)

        for core, group in core_groups.items():
            if len(group) < 2:
                continue
            group_sorted = sorted(group, key=lambda n: -G.degree(n))
            keep = group_sorted[0]
            labels = [G.nodes[n].get('label', n) for n in group]
            print(f"  Merging by core-label {core!r}: {labels}")
            print(f"    keep={keep!r} (degree={G.degree(keep)})")
            for drop in group_sorted[1:]:
                if G.has_node(drop):
                    print(f"    drop={drop!r} (degree={G.degree(drop)})")
                    merge_nodes(G, keep, drop)
                    merged += 1

    print(f"\nMerged {merged} additional nodes")
    print(f"After: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")

    # Verify cn() state
    cn_nodes = [(n, G.nodes[n]) for n in G.nodes() if 'cn' in G.nodes[n].get('label','').lower() and G.nodes[n].get('source_file','').endswith('utils.ts')]
    print(f"\ncn-related nodes in utils.ts: {len(cn_nodes)}")
    for nid, nd in sorted(cn_nodes, key=lambda x: -G.degree(x[0])):
        print(f"  [{G.degree(nid):3d} edges] {nd.get('label')!r} ({nd.get('source_file')})")

    graph_path.write_text(json.dumps(json_graph.node_link_data(G, edges='links'), ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"Saved.")


if __name__ == '__main__':
    main()
