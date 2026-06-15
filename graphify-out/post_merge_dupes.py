"""
Post-processing: merge duplicate nodes that refer to the same entity
(caused by inconsistent path normalization during extraction).

Strategy:
1. Normalize all source_file paths (strip leading 'src/', lower-case, forward slash)
2. Group nodes by (normalized_source_file, normalized_label)
3. For each group > 1: keep the node with highest degree, redirect all edges
4. Write merged graph back to graph.json
"""
import json
import re
from pathlib import Path
from collections import defaultdict
from networkx.readwrite import json_graph
import networkx as nx


def normalize_path(p: str) -> str:
    p = p.replace('\\', '/')
    p = re.sub(r'^\./', '', p)
    p = re.sub(r'^src/', '', p)
    return p.lower()


def normalize_label(label: str) -> str:
    return re.sub(r'\s+', ' ', label.lower().strip())


def merge_nodes(G: nx.Graph, keep: str, drop: str):
    """Redirect all edges from drop -> keep, then remove drop."""
    for neighbor in list(G.neighbors(drop)):
        if neighbor == keep:
            continue
        edge_data = G.get_edge_data(drop, neighbor) or {}
        if not G.has_edge(keep, neighbor):
            G.add_edge(keep, neighbor, **edge_data)
        # else: edge already exists, keep existing (higher confidence)
    G.remove_node(drop)


def main():
    graph_path = Path('graphify-out/graph.json')
    data = json.loads(graph_path.read_text(encoding='utf-8'))
    G = json_graph.node_link_graph(data, edges='links')

    print(f"Before: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")

    # Build groups
    groups = defaultdict(list)
    for n in G.nodes():
        nd = G.nodes[n]
        src = normalize_path(nd.get('source_file', ''))
        label = normalize_label(nd.get('label', n))
        key = (src, label)
        groups[key].append(n)

    duplicates = {k: v for k, v in groups.items() if len(v) > 1}
    print(f"Duplicate groups found: {len(duplicates)}")

    merged = 0
    for key, nodes in duplicates.items():
        # Keep highest-degree node
        nodes_sorted = sorted(nodes, key=lambda n: -G.degree(n))
        keep = nodes_sorted[0]
        drops = nodes_sorted[1:]
        labels = [G.nodes[n].get('label', n) for n in nodes]
        print(f"  Merging {len(nodes)} nodes: {labels}")
        print(f"    keep={keep!r} (degree={G.degree(keep)})")
        for drop in drops:
            if G.has_node(drop):
                print(f"    drop={drop!r} (degree={G.degree(drop)})")
                merge_nodes(G, keep, drop)
                merged += 1

    print(f"\nMerged {merged} duplicate nodes")
    print(f"After: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")

    # Write back
    out = json_graph.node_link_data(G, edges='links')
    graph_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"Saved to {graph_path}")


if __name__ == '__main__':
    main()
